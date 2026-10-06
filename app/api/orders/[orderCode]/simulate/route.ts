import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processPaymentSettlement } from '@/lib/sepay-engine';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;
    const { mode = 'FULL_PAYMENT' } = (await request.json().catch(() => ({}))) as {
      mode?: 'FULL_PAYMENT' | 'UNDERPAID' | 'EXPIRED_LATE';
    };

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

    // Test Case: Simulate Late Payment (force order to EXPIRED first)
    if (mode === 'EXPIRED_LATE') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'EXPIRED',
          expiresAt: new Date(Date.now() - 60000),
        },
      });

      // Release stock back to available
      if (order.stock) {
        await prisma.stock.update({
          where: { id: order.stock.id },
          data: {
            status: 'AVAILABLE',
            orderId: null,
            reservedUntil: null,
          },
        });
      }
    }

    // Determine amount based on mode
    let simulatedAmount: number | string =
      order.gateway === 'SEPAY' ? order.totalVND : order.totalLTC || '0.045000';

    if (mode === 'UNDERPAID') {
      simulatedAmount =
        order.gateway === 'SEPAY'
          ? Math.max(1000, Math.floor(order.totalVND * 0.5)) // 50% underpaid
          : (Number(order.totalLTC) * 0.5).toFixed(6);
    }

    const providerTransactionId = `SIM_${order.gateway}_${Date.now()}`;

    const result = await processPaymentSettlement({
      orderCode,
      gateway: order.gateway as any,
      providerTransactionId,
      amount: simulatedAmount,
      rawPayload: {
        simulated: true,
        mode,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      mode,
      ...result,
    });
  } catch (error: any) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
