export interface LitecoinConfig {
  merchantAddress: string;
}

export function getLitecoinConfig(): LitecoinConfig {
  return {
    merchantAddress:
      process.env.LTC_MERCHANT_ADDRESS || 'ltc1q4z2u3v6k9w8x7m5p4q3a2b1c0d9e8f7g6h5j4k',
  };
}

export function convertVndToLtc(amountVND: number, ltcVndRate: number): number {
  const ltc = amountVND / (ltcVndRate || 2250000);
  return Number(ltc.toFixed(6));
}

export function generateLtcUri(address: string, amountLtc: number, label = 'ChinStore Order'): string {
  return `litecoin:${address}?amount=${amountLtc}&label=${encodeURIComponent(label)}`;
}

/**
 * Check if the merchant LTC address has received an unconfirmed or confirmed transaction
 * for the required amount since the order timestamp.
 */
export async function verifyLtcTransaction(
  address: string,
  expectedLtc: number,
  orderTimestamp: Date
): Promise<{ success: boolean; txHash?: string; receivedAmount?: number }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/full?limit=10`,
      {
        signal: controller.signal,
        next: { revalidate: 10 },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const txs = data.txs || [];
      const orderEpoch = Math.floor(orderTimestamp.getTime() / 1000);

      // Check transactions
      for (const tx of txs) {
        const txTime = tx.received ? Math.floor(new Date(tx.received).getTime() / 1000) : 0;
        // If transaction occurred after or around order creation
        if (txTime >= orderEpoch - 300) {
          // Find output to merchant address
          for (const output of tx.outputs || []) {
            if (output.addresses && output.addresses.includes(address)) {
              const amountInLtc = output.value / 100000000; // satoshis to LTC
              // allow slight variance due to floating precision (e.g. 0.0001 LTC)
              if (amountInLtc >= expectedLtc * 0.99) {
                return {
                  success: true,
                  txHash: tx.hash,
                  receivedAmount: amountInLtc,
                };
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('BlockCypher query failed, will rely on manual simulation or webhook:', error);
  }

  return { success: false };
}
