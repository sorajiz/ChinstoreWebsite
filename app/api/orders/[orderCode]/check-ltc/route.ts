import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { queryLtcAddressTransactions } from '@/lib/ltc-engines';
import { processPaymentSettlement } from '@/lib/sepay-engine';
import Decimal from 'decimal.js';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { stock: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    if (order.status === 'PAID') {
      return NextResponse.json({
        success: true,
        status: 'PAID',
        message: 'Đơn hàng đã được xác nhận thanh toán',
      });
    }

    const merchantAddress =
      process.env.LTC_MERCHANT_ADDRESS || 'ltc1q4z2u3v6k9w8x7m5p4q3a2b1c0d9e8f7g6h5j4k';
    const expectedLtc = new Decimal(order.totalLTC || '0');
    const orderCreatedAtMs = order.createdAt.getTime() - 60 * 1000;
    const tolerance = new Decimal('0.0001');

    // Query 4 Blockchain Explorer Engines
    const txs = await queryLtcAddressTransactions(merchantAddress);

    for (const tx of txs) {
      if (tx.timestamp >= orderCreatedAtMs) {
        const received = new Decimal(tx.amountLtc);
        if (received.plus(tolerance).greaterThanOrEqualTo(expectedLtc)) {
          const result = await processPaymentSettlement({
            orderCode: order.orderCode,
            gateway: 'LITECOIN',
            providerTransactionId: tx.txHash,
            amount: tx.amountLtc,
            rawPayload: tx,
          });

          return NextResponse.json({
            success: true,
            status: result.status,
            message: result.message,
            txHash: tx.txHash,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      status: 'PAYMENT_PENDING',
      message: 'Chưa phát hiện giao dịch LTC hợp lệ trong mempool, tiếp tục chờ...',
    });
  } catch (error: any) {
    console.error('Error verifying LTC:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi kiểm tra giao dịch Litecoin' },
      { status: 500 }
    );
  }
}
