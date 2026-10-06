export interface SePayConfig {
  bankCode: string;
  accountNo: string;
  accountName: string;
  apiKey: string;
}

export function getSePayConfig(): SePayConfig {
  return {
    bankCode: process.env.SEPAY_BANK_CODE || 'MB',
    accountNo: process.env.SEPAY_ACCOUNT_NO || '0398668999',
    accountName: process.env.SEPAY_ACCOUNT_NAME || 'CHIN STORE CYBER',
    apiKey: process.env.SEPAY_API_KEY || 'sepay_secret_key_chin_store_2025',
  };
}

export function generateVietQrUrl(params: {
  bankCode: string;
  accountNo: string;
  amount: number;
  orderCode: string;
}): string {
  const { bankCode, accountNo, amount, orderCode } = params;
  const encodedBank = encodeURIComponent(bankCode.trim());
  const encodedAcc = encodeURIComponent(accountNo.trim());
  const encodedDes = encodeURIComponent(orderCode.trim());
  return `https://qr.sepay.vn/img?bank=${encodedBank}&acc=${encodedAcc}&template=compact&amount=${Math.round(amount)}&des=${encodedDes}`;
}

export function verifySePayWebhookAuth(authHeader: string | null): boolean {
  const config = getSePayConfig();
  if (!config.apiKey) return true; // If not set, allow dev
  if (!authHeader) return false;

  // Support "Apikey <TOKEN>" or "Bearer <TOKEN>" or direct string
  const cleanHeader = authHeader.replace(/^Bearer\s+/i, '').replace(/^Apikey\s+/i, '').trim();
  return cleanHeader === config.apiKey.trim();
}
