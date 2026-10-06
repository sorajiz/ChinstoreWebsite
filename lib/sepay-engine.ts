import { prisma } from './prisma';
import Decimal from 'decimal.js';

// Cache for SePay Polling
let cachedTransactions: { data: any[]; timestamp: number } | null = null;
const POLLING_CACHE_TTL = 10 * 1000; // 10s

export function verifySepayWebhookSecret(authHeader: string | null): boolean {
  const secret = process.env.SEPAY_WEBHOOK_SECRET || process.env.SEPAY_API_KEY || 'sepay_secret_key_chin_store_2025';
  if (!secret) return true;
  if (!authHeader) return false;

  const token = authHeader.replace(/^Bearer\s+/i, '').replace(/^Apikey\s+/i, '').trim();
  return token === secret.trim();
}

/**
 * Regex to extract 7-character Base32 orderCode:
 * [23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}
 */
export function extract7CharOrderCode(text: string): string | null {
  if (!text) return null;
  const upper = text.toUpperCase();

  // 1. Search for standalone token matching exact 7-char Base32 pattern
  const tokens = upper.split(/[\s\-_:,;./\\()]+/);
  for (const token of tokens) {
    if (/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}$/.test(token)) {
      return token;
    }
  }

  // 2. Check for prefixes like ORD, DH, CHIN followed by 7-char code
  const prefixMatch = upper.match(/(?:ORD|DH|CHIN|DONHANG)[-_:\s]*([23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7})/);
  if (prefixMatch) {
    return prefixMatch[1];
  }

  // 3. Fallback with word boundaries
  const match = upper.match(/\b([23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7})\b/);
  return match ? match[1] : null;
}

/**
 * Fuzzy matching helper:
 * Normalizes transfer content and checks whether it contains the orderCode
 */
export function isFuzzyMatchOrder(content: string, orderCode: string): boolean {
  if (!content || !orderCode) return false;
  const cleanContent = content.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cleanCode = orderCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return cleanContent.includes(cleanCode);
}

/**
 * Dual-Engine SePay Transaction Fetcher:
 * Engine 1: SePay API v2 (https://userapi.sepay.vn/v2/transactions)
 * Engine 2: SePay Legacy (https://my.sepay.vn/userapi/transactions/list)
 */
export async function fetchRecentSepayTransactions(): Promise<any[]> {
  const now = Date.now();
  if (cachedTransactions && now - cachedTransactions.timestamp < POLLING_CACHE_TTL) {
    return cachedTransactions.data;
  }

  const apiToken = process.env.SEPAY_API_TOKEN || process.env.SEPAY_API_KEY;
  if (!apiToken) return [];

  // Engine 1: SePay v2
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://userapi.sepay.vn/v2/transactions?limit=30', {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const list = data.transactions || data.data || [];
      cachedTransactions = { data: list, timestamp: now };
      return list;
    }
  } catch (err) {
    console.warn('SePay API v2 fetch failed, trying legacy fallback:', err);
  }

  // Engine 2: SePay Legacy
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://my.sepay.vn/userapi/transactions/list?limit=30', {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const list = data.messages || data.data || [];
      cachedTransactions = { data: list, timestamp: now };
      return list;
    }
  } catch (err) {
    console.warn('SePay Legacy API fetch failed:', err);
  }

  return [];
}

/**
 * Process a confirmed bank or crypto transaction with 3-tier rules and edge case guards:
 * - Late Payment Guard (6.1)
 * - Underpaid Guard (6.2)
 * - Idempotency
 * - Atomic stock transition to SOLD
 */
export async function processPaymentSettlement(params: {
  orderCode: string;
  gateway: 'SEPAY' | 'LITECOIN';
  providerTransactionId: string;
  amount: number | string;
  rawPayload: any;
}): Promise<{ success: boolean; status: string; message: string }> {
  const { orderCode, gateway, providerTransactionId, amount, rawPayload } = params;

  // 1. Check Idempotency: Has this transaction ID already been processed?
  const existingTx = await prisma.paymentTransaction.findUnique({
    where: { providerTransactionId: String(providerTransactionId) },
  });

  if (existingTx) {
    return {
      success: true,
      status: 'IDEMPOTENT_IGNORED',
      message: 'Giao dịch đã được xử lý trước đó (Idempotent)',
    };
  }

  // 2. Find Order
  const order = await prisma.order.findUnique({
    where: { orderCode },
    include: {
      stock: true,
    },
  });

  if (!order) {
    return {
      success: false,
      status: 'ORDER_NOT_FOUND',
      message: `Không tìm thấy đơn hàng ${orderCode}`,
    };
  }

  // If already paid, record transaction and exit
  if (order.status === 'PAID') {
    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        gateway,
        providerTransactionId: String(providerTransactionId),
        amount: String(amount),
        rawPayload: JSON.stringify(rawPayload),
      },
    });
    return {
      success: true,
      status: 'ALREADY_PAID',
      message: 'Đơn hàng này đã hoàn tất thanh toán từ trước',
    };
  }

  // 3. CRITICAL EDGE CASE 6.1: Late Payment Guard
  // If order was already marked EXPIRED or CANCELLED
  if (order.status === 'EXPIRED' || order.status === 'CANCELLED') {
    console.warn(`[LATE PAYMENT GUARD] Order ${orderCode} was ${order.status}. Entering MANUAL_REVIEW.`);

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'MANUAL_REVIEW',
          reviewReason: `PAID_AFTER_EXPIRATION: Nhận ${amount} sau khi đơn đã hết hạn lúc ${order.expiresAt.toISOString()}`,
        },
      }),
      prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          gateway,
          providerTransactionId: String(providerTransactionId),
          amount: String(amount),
          rawPayload: JSON.stringify(rawPayload),
        },
      }),
    ]);

    return {
      success: false,
      status: 'MANUAL_REVIEW',
      message: 'Đơn hàng đã hết hạn trước khi nhận được tiền. Đã chuyển sang hàng đợi Chờ xử lý thủ công (MANUAL_REVIEW).',
    };
  }

  // 4. CRITICAL EDGE CASE 6.2: Underpaid Guard
  // For SEPAY: check VND with 500 VND tolerance
  if (gateway === 'SEPAY') {
    const receivedVND = new Decimal(amount);
    const requiredVND = new Decimal(order.totalVND);
    const tolerance = new Decimal(500);

    if (receivedVND.plus(tolerance).lessThan(requiredVND)) {
      console.warn(`[UNDERPAID GUARD] Order ${orderCode}: Received ${amount} VND, required ${order.totalVND} VND`);

      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'UNDERPAID',
            reviewReason: `Thiếu tiền: Đã chuyển ${amount}/${order.totalVND} VND`,
          },
        }),
        prisma.paymentTransaction.create({
          data: {
            orderId: order.id,
            gateway,
            providerTransactionId: String(providerTransactionId),
            amount: String(amount),
            rawPayload: JSON.stringify(rawPayload),
          },
        }),
      ]);

      return {
        success: false,
        status: 'UNDERPAID',
        message: `Chuyển thiếu tiền. Đã nhận: ${amount} VND, Cần: ${order.totalVND} VND.`,
      };
    }
  }

  // 5. VALID PAYMENT: Atomic Settlement & Stock Confirmation
  await prisma.$transaction(async (tx) => {
    // Update Order to PAID
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    // Update reserved stock to SOLD
    if (order.stock) {
      await tx.stock.update({
        where: { id: order.stock.id },
        data: {
          status: 'SOLD',
          reservedUntil: null,
        },
      });
    }

    // Record Payment Transaction
    await tx.paymentTransaction.create({
      data: {
        orderId: order.id,
        gateway,
        providerTransactionId: String(providerTransactionId),
        amount: String(amount),
        rawPayload: JSON.stringify(rawPayload),
      },
    });
  });

  console.log(`[PAYMENT CONFIRMED] Order ${orderCode} settled successfully via ${gateway}!`);
  return {
    success: true,
    status: 'PAID',
    message: `Đơn hàng ${orderCode} đã được thanh toán và giao hàng tự động thành công!`,
  };
}
