import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CurrencyType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const USD_RATE = 25400; // 1 USD = 25,400 VND

export function formatPrice(
  amountVND: number,
  currency: CurrencyType = 'VND',
  ltcRateVND: number = 2250000
): string {
  switch (currency) {
    case 'VND':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(amountVND);

    case 'USD':
      const usdAmount = amountVND / USD_RATE;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usdAmount);

    case 'LTC':
      const ltcAmount = amountVND / (ltcRateVND || 2250000);
      return `${ltcAmount.toFixed(5)} LTC`;

    default:
      return `${amountVND.toLocaleString()} ₫`;
  }
}

export function generateOrderCode(): string {
  // Generate distinct memorable order code e.g. CHIN8293
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CHIN${randomStr}`;
}
