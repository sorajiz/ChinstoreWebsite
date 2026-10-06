import { NextRequest, NextResponse } from 'next/server';
import {
  verifySepayWebhookSecret,
  extract7CharOrderCode,
  processPaymentSettlement,
  isFuzzyMatchOrder,
} from '@/lib/sepay-engine';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('x-api-key');

    // 1. Verify Authentication
    if (!verifySepayWebhookSecret(authHeader)) {
      console.warn('[SEPAY WEBHOOK] Unauthorized request attempt');
      return NextResponse.json(
        { success: false, message: 'Unauthorized webhook' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    console.log('[SEPAY WEBHOOK] Received payload:', payload);

    const {
      id: transactionId,
      transferAmount,
      content = '',
      code = '',
      referenceCode,
    } = payload;

    const providerTransactionId = String(transactionId || referenceCode || Date.now());

    // 2. Extract 7-character Base32 orderCode
    let orderCode = extract7CharOrderCode(`${content} ${code}`);

    // If exact regex match failed, attempt fuzzy search over pending orders
    if (!orderCode) {
      const pendingOrders = await prisma.order.findMany({
        where: {
          status: 'PAYMENT_PENDING',
          gateway: 'SEPAY',
        },
        select: { orderCode: true },
      });

      for (const ord of pendingOrders) {
        if (isFuzzyMatchOrder(content, ord.orderCode)) {
          orderCode = ord.orderCode;
          break;
        }
      }
    }

    if (!orderCode) {
      console.warn(`[SEPAY WEBHOOK] Could not match any order code in memo: "${content}"`);
      return NextResponse.json({
        success: true,
        message: 'No matching order found in memo, acknowledged',
      });
    }

    // 3. Process payment settlement with 3-tier rules & edge-case guards
    const result = await processPaymentSettlement({
      orderCode,
      gateway: 'SEPAY',
      providerTransactionId,
      amount: Number(transferAmount) || 0,
      rawPayload: payload,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[SEPAY WEBHOOK ERROR]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý webhook' },
      { status: 500 }
    );
  }
}
