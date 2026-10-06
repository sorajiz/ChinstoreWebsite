import { prisma } from './prisma';

let isRunning = false;

/**
 * Sweeper worker: Scans for expired orders and atomically releases their reserved stock items
 */
export async function runExpirationSweep(): Promise<{ expiredCount: number }> {
  if (isRunning) return { expiredCount: 0 };
  isRunning = true;

  try {
    const now = new Date();

    // 1. Find all pending orders that have passed their 10-minute expiration
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'PAYMENT_PENDING',
        expiresAt: { lt: now },
      },
      include: {
        stock: true,
      },
    });

    if (expiredOrders.length === 0) {
      return { expiredCount: 0 };
    }

    console.log(`[EXPIRATION WORKER] Found ${expiredOrders.length} expired orders. Releasing reserved stocks...`);

    // 2. Atomically mark each order as EXPIRED and release its Stock back to AVAILABLE
    for (const order of expiredOrders) {
      await prisma.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'EXPIRED' },
        });

        // Revert reserved stock back to AVAILABLE
        if (order.stock && order.stock.status === 'RESERVED') {
          await tx.stock.update({
            where: { id: order.stock.id },
            data: {
              status: 'AVAILABLE',
              orderId: null,
              reservedUntil: null,
            },
          });
          console.log(`[STOCK RELEASED] Stock ${order.stock.id} returned to AVAILABLE from expired order ${order.orderCode}`);
        }
      });
    }

    return { expiredCount: expiredOrders.length };
  } catch (error) {
    console.error('[EXPIRATION WORKER ERROR]:', error);
    return { expiredCount: 0 };
  } finally {
    isRunning = false;
  }
}
