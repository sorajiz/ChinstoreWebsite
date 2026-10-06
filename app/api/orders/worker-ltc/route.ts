import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { queryLtcAddressTransactions } from '@/lib/ltc-engines';
import { processPaymentSettlement } from '@/lib/sepay-engine';
import { runExpirationSweep } from '@/lib/expiration-worker';
import Decimal from 'decimal.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Run expiration sweep
    await runExpirationSweep();

    const merchantAddress =
      process.env.LTC_MERCHANT_ADDRESS || 'ltc1q4z2u3v6k9w8x7m5p4q3a2b1c0d9e8f7g6h5j4k';

    // 2. Fetch pending LTC orders
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PAYMENT_PENDING',
        gateway: 'LITECOIN',
      },
    });

    if (pendingOrders.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending Litecoin orders' });
    }

    // 3. SECTION 5.3: Descending Sort by required LTC amount
    // Sắp xếp các đơn có lượng LTC từ cao xuống thấp để khớp đơn lớn trước
    pendingOrders.sort((a, b) => {
      const ltcA = new Decimal(a.totalLTC || '0');
      const ltcB = new Decimal(b.totalLTC || '0');
      return ltcB.minus(ltcA).toNumber();
    });

    // 4. Query 4 Litecoin Blockchain Explorers
    const onChainTxs = await queryLtcAddressTransactions(merchantAddress);
    let matchedCount = 0;

    for (const order of pendingOrders) {
      const expectedLtc = new Decimal(order.totalLTC || '0');
      const orderCreatedAtMs = order.createdAt.getTime() - 60 * 1000; // 60s grace
      const tolerance = new Decimal('0.0001'); // ±0.0001 LTC network fee tolerance

      for (const tx of onChainTxs) {
        const receivedLtc = new Decimal(tx.amountLtc);
        // Check time
        if (tx.timestamp >= orderCreatedAtMs) {
          // Check amount with ±0.0001 LTC tolerance
          if (receivedLtc.plus(tolerance).greaterThanOrEqualTo(expectedLtc)) {
            const settleRes = await processPaymentSettlement({
              orderCode: order.orderCode,
              gateway: 'LITECOIN',
              providerTransactionId: tx.txHash,
              amount: tx.amountLtc,
              rawPayload: tx,
            });

            if (settleRes.success) {
              matchedCount++;
              break;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      pendingCount: pendingOrders.length,
      matchedCount,
    });
  } catch (error: any) {
    console.error('LTC worker error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
