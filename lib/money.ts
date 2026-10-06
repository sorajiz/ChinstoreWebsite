import Decimal from 'decimal.js';

// Configure Decimal.js precision
Decimal.set({ precision: 28, rounding: Decimal.ROUND_UP });

export const USD_TO_VND_RATE = new Decimal(25400);

/**
 * Generate 7-character Base32 orderCode from strict alphanumeric set:
 * 23456789ABCDEFGHJKLMNPQRSTUVWXYZ (eliminating ambiguous 0, O, 1, I)
 */
export function generateBase32OrderCode(): string {
  const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

/**
 * Convert VND amount to USD using Decimal.js
 */
export function convertVndToUsd(amountVND: number | string): Decimal {
  const vnd = new Decimal(amountVND);
  return vnd.dividedBy(USD_TO_VND_RATE);
}

/**
 * Convert VND amount to Litecoin (LTC) strictly using Decimal.js:
 * USD = VND / 25400
 * LTC = USD / ltcUsdRate
 * Formatted to 6 decimal places with Decimal.ROUND_UP
 */
export function convertVndToLtcExact(
  amountVND: number | string,
  ltcUsdRate: number | string
): string {
  const vnd = new Decimal(amountVND);
  const ltcUsd = new Decimal(ltcUsdRate || '88.5');

  if (ltcUsd.isZero() || ltcUsd.isNegative()) {
    throw new Error('Tỷ giá LTC/USD không hợp lệ');
  }

  // USD = VND / 25400
  const usd = vnd.dividedBy(USD_TO_VND_RATE);

  // LTC = USD / ltcUsd
  const ltc = usd.dividedBy(ltcUsd);

  // Round UP to 6 decimal places (e.g. "0.045120")
  return ltc.toFixed(6, Decimal.ROUND_UP);
}

/**
 * Safely compare two money amounts with tolerance
 */
export function isAmountAcceptable(
  paidAmount: number | string,
  expectedAmount: number | string,
  tolerance: number | string = 0
): boolean {
  const paid = new Decimal(paidAmount);
  const expected = new Decimal(expectedAmount);
  const tol = new Decimal(tolerance);

  // paid + tol >= expected
  return paid.plus(tol).greaterThanOrEqualTo(expected);
}

/**
 * Calculate missing amount if underpaid
 */
export function calculateMissingAmount(
  paidAmount: number | string,
  expectedAmount: number | string
): string {
  const paid = new Decimal(paidAmount);
  const expected = new Decimal(expectedAmount);
  const missing = expected.minus(paid);
  return missing.isPositive() ? missing.toString() : '0';
}
