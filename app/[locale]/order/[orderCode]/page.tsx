import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { decryptAccountData } from '@/lib/crypto-vault';
import { runExpirationSweep } from '@/lib/expiration-worker';
import FocusedCheckoutCockpit from '@/components/checkout/FocusedCheckoutCockpit';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrderCockpitPage({
  params,
}: {
  params: { orderCode: string; locale: string };
}) {
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
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl glass-card border border-white/10 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white font-display">
            Không Tìm Thấy Đơn Hàng #{orderCode}
          </h2>
          <p className="text-xs text-slate-400">
            Mã đơn hàng không tồn tại hoặc đã bị xóa khỏi hệ thống.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Cửa Hàng</span>
          </Link>
        </div>
      </div>
    );
  }

  // Decrypt data if PAID
  let decryptedData: string | null = null;
  if (order.status === 'PAID' && order.stock) {
    try {
      decryptedData = decryptAccountData(
        order.stock.encryptedData,
        order.stock.iv,
        order.stock.authTag
      );
    } catch (e) {
      decryptedData = 'Lỗi giải mã: Vui lòng liên hệ Admin qua Telegram để nhận dữ liệu tài khoản';
    }
  }

  // Payment details
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

  const initialOrderData = {
    id: order.id,
    orderCode: order.orderCode,
    customerEmail: order.customerEmail,
    totalVND: order.totalVND,
    totalLTC: order.totalLTC || undefined,
    gateway: order.gateway as 'SEPAY' | 'LITECOIN',
    status: order.status as any,
    reviewReason: order.reviewReason || undefined,
    expiresAt: order.expiresAt.toISOString(),
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    items: order.items.map((i) => ({
      id: i.id,
      product: {
        id: i.product.id,
        name: i.product.name,
        slug: i.product.slug,
        description: i.product.description,
        images: JSON.parse(i.product.images || '[]'),
        warrantyPolicy: i.product.warrantyPolicy || undefined,
      },
      priceVND: i.priceVND,
      quantity: i.quantity,
    })),
    decryptedData,
    paymentDetails,
    totalReceived,
  };

  return <FocusedCheckoutCockpit initialOrder={initialOrderData} />;
}
