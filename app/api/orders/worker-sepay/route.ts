import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  fetchRecentSepayTransactions,
  isFuzzyMatchOrder,
  processPaymentSettlement,
  extract7CharOrderCode,
} from '@/lib/sepay-engine';
import { runExpirationSweep } from '@/lib/expiration-worker';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Run expiration sweep
    await runExpirationSweep();

    // 2. Fetch all pending SePay orders
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PAYMENT_PENDING',
        gateway: 'SEPAY',
      },
    });

    if (pendingOrders.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending SePay orders' });
    }

    // 3. Fetch recent bank transactions via Dual-Engine (v2 + legacy fallback)
    const recentTxs = await fetchRecentSepayTransactions();
    let settledCount = 0;

    for (const order of pendingOrders) {
      const orderEpoch = order.createdAt.getTime() - 2 * 60 * 1000; // 2 min grace

      for (const tx of recentTxs) {
        const content = tx.transaction_content || tx.content || '';
        const txAmount = Number(tx.amount_in || tx.transferAmount || tx.amount || 0);
        const txId = String(tx.id || tx.reference_number || `${tx.transaction_date}_${txAmount}`);

        // Check if content matches orderCode
        const extractedCode = extract7CharOrderCode(content);
        const isMatched = extractedCode === order.orderCode || isFuzzyMatchOrder(content, order.orderCode);

        if (isMatched) {
          const txTime = tx.transaction_date ? new Date(tx.transaction_date).getTime() : Date.now();
          if (txTime >= orderEpoch) {
            const settleRes = await processPaymentSettlement({
              orderCode: order.orderCode,
              gateway: 'SEPAY',
              providerTransactionId: txId,
              amount: txAmount,
              rawPayload: tx,
            });

            if (settleRes.success) {
              settledCount++;
              break;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      pendingCount: pendingOrders.length,
      settledCount,
    });
  } catch (error: any) {
    console.error('SePay polling worker error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
