import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateBase32OrderCode, convertVndToLtcExact } from '@/lib/money';
import { fetchLtcUsdPrice } from '@/lib/ltc-engines';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { runExpirationSweep } from '@/lib/expiration-worker';
import Decimal from 'decimal.js';

export async function POST(request: NextRequest) {
  try {
    // Run expiration sweep to release any expired stocks
    await runExpirationSweep();

    const body = await request.json();
    const { customerEmail, paymentMethod, productId } = body;

    if (!customerEmail || !productId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin Email nhận hàng hoặc sản phẩm cần mua' },
        { status: 400 }
      );
    }

    if (paymentMethod !== 'SEPAY' && paymentMethod !== 'LITECOIN') {
      return NextResponse.json(
        { success: false, error: 'Phương thức thanh toán không hợp lệ' },
        { status: 400 }
      );
    }

    // Get user session if logged in
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    // Check product in DB
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    // Fetch live LTC price for strict Decimal.js price lock (10 minutes)
    const ltcUsdPrice = await fetchLtcUsdPrice();
    const totalLTC = convertVndToLtcExact(product.priceVND, ltcUsdPrice);

    // 10 minutes expiration window (Atomic Reservation Lock)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    // Generate unique 7-character Base32 orderCode
    let orderCode = generateBase32OrderCode();
    let existingOrder = await prisma.order.findUnique({ where: { orderCode } });
    while (existingOrder) {
      orderCode = generateBase32OrderCode();
      existingOrder = await prisma.order.findUnique({ where: { orderCode } });
    }

    // ATOMIC RESERVATION (Section 3.2):
    // Use transaction to atomically lock an AVAILABLE stock item for 10 minutes
    const order = await prisma.$transaction(async (tx) => {
      // 1. Find an available stock item for this product
      const availableStock = await tx.stock.findFirst({
        where: {
          productId: product.id,
          status: 'AVAILABLE',
        },
      });

      if (!availableStock) {
        throw new Error('Sản phẩm tạm thời hết hàng trong kho. Vui lòng quay lại sau!');
      }

      // 2. Create the Order
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          userId,
          customerEmail: customerEmail.trim().toLowerCase(),
          totalVND: product.priceVND,
          totalLTC,
          gateway: paymentMethod,
          status: 'PAYMENT_PENDING',
          expiresAt,
          items: {
            create: [
              {
                productId: product.id,
                priceVND: product.priceVND,
                quantity: 1,
              },
            ],
          },
        },
      });

      // 3. Atomically reserve this stock item for this order
      await tx.stock.update({
        where: { id: availableStock.id },
        data: {
          status: 'RESERVED',
          orderId: newOrder.id,
          reservedUntil: expiresAt,
        },
      });

      return newOrder;
    });

    // Build gateway specific payment details
    let paymentDetails: any = {
      orderCode,
      gateway: paymentMethod,
      expiresAt: order.expiresAt.toISOString(),
    };

    if (paymentMethod === 'SEPAY') {
      const bankAcc = process.env.SEPAY_ACCOUNT_NO || '0398668999';
      const bankId = process.env.SEPAY_BANK_CODE || 'MB';
      const bankName = process.env.SEPAY_ACCOUNT_NAME || 'CHIN STORE CYBER';
      const qrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(bankAcc)}&bank=${encodeURIComponent(bankId)}&amount=${order.totalVND}&des=${encodeURIComponent(orderCode)}&template=compact`;

      paymentDetails = {
        ...paymentDetails,
        bankCode: bankId,
        accountNo: bankAcc,
        accountName: bankName,
        amount: order.totalVND,
        qrUrl,
      };
    } else if (paymentMethod === 'LITECOIN') {
      const merchantAddress =
        process.env.LTC_MERCHANT_ADDRESS || 'ltc1q4z2u3v6k9w8x7m5p4q3a2b1c0d9e8f7g6h5j4k';
      const ltcUri = `litecoin:${merchantAddress}?amount=${totalLTC}&label=${encodeURIComponent(orderCode)}`;

      paymentDetails = {
        ...paymentDetails,
        address: merchantAddress,
        amountLtc: totalLTC,
        ltcUsdRate: ltcUsdPrice,
        qrUri: ltcUri,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        product,
        paymentDetails,
      },
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi tạo đơn hàng' },
      { status: 400 }
    );
  }
}
