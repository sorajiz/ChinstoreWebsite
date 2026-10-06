import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptAccountData } from '@/lib/crypto-vault';
import { runExpirationSweep } from '@/lib/expiration-worker';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    // Run passive sweep
    await runExpirationSweep();

    const { orderCode } = params;

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        stock: true,
        transactions: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    let decryptedData: string | null = null;

    // SECTION 7: On-Page Instant Fulfillment
    // ONLY decrypt credentials if order is strictly PAID
    if (order.status === 'PAID' && order.stock) {
      try {
        decryptedData = decryptAccountData(
          order.stock.encryptedData,
          order.stock.iv,
          order.stock.authTag
        );
      } catch (decErr) {
        console.error('Decryption failed for paid order:', decErr);
        decryptedData = 'Lỗi giải mã: Vui lòng liên hệ Admin để nhận dữ liệu tài khoản';
      }
    }

    // Build payment details if pending
    let paymentDetails: any = null;
    if (order.status === 'PAYMENT_PENDING') {
      if (order.gateway === 'SEPAY') {
        const bankAcc = process.env.SEPAY_ACCOUNT_NO || '0398668999';
        const bankId = process.env.SEPAY_BANK_CODE || 'MB';
        const bankName = process.env.SEPAY_ACCOUNT_NAME || 'CHIN STORE CYBER';
        const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(bankAcc)}&bank=${encodeURIComponent(bankId)}&amount=${order.totalVND}&des=${encodeURIComponent(order.orderCode)}&template=compact`;

        paymentDetails = {
          gateway: 'SEPAY',
          bankCode: bankId,
          accountNo: bankAcc,
          accountName: bankName,
          amount: order.totalVND,
          orderCode: order.orderCode,
          qrUrl,
          expiresAt: order.expiresAt.toISOString(),
        };
      } else if (order.gateway === 'LITECOIN') {
        const merchantAddress =
          process.env.LTC_MERCHANT_ADDRESS || 'ltc1q4z2u3v6k9w8x7m5p4q3a2b1c0d9e8f7g6h5j4k';
        const ltcUri = `litecoin:${merchantAddress}?amount=${order.totalLTC}&label=${encodeURIComponent(order.orderCode)}`;

        paymentDetails = {
          gateway: 'LITECOIN',
          address: merchantAddress,
          amountLtc: order.totalLTC,
          orderCode: order.orderCode,
          qrUri: ltcUri,
          expiresAt: order.expiresAt.toISOString(),
        };
      }
    }

    // Calculate received amount for Underpaid scenario
    let totalReceived = '0';
    if (order.transactions.length > 0) {
      const sum = order.transactions.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
      totalReceived = String(sum);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderCode: order.orderCode,
        customerEmail: order.customerEmail,
        totalVND: order.totalVND,
        totalLTC: order.totalLTC,
        gateway: order.gateway,
        status: order.status,
        reviewReason: order.reviewReason,
        expiresAt: order.expiresAt.toISOString(),
        paidAt: order.paidAt ? order.paidAt.toISOString() : null,
        items: order.items.map((i) => ({
          id: i.id,
          product: {
            ...i.product,
            images: JSON.parse(i.product.images || '[]'),
          },
          priceVND: i.priceVND,
          quantity: i.quantity,
        })),
        decryptedData, // Only present when PAID
        paymentDetails,
        totalReceived,
      },
    });
  } catch (error: any) {
    console.error('Error querying order:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tra cứu đơn hàng' },
      { status: 500 }
    );
  }
}
