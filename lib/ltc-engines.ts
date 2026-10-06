import Decimal from 'decimal.js';
import { convertVndToLtcExact } from './money';

export interface LtcTxResult {
  txHash: string;
  amountLtc: string;
  confirmations: number;
  timestamp: number;
  isMempool0Conf: boolean;
}

// In-memory cache for Price Oracle
let cachedLtcPriceUsd: { price: string; timestamp: number } | null = null;
const PRICE_CACHE_TTL = 60 * 1000; // 60s cache

/**
 * 3-Tier Price Oracle Pipeline:
 * 1. CoinGecko API
 * 2. CryptoCompare API
 * 3. Fallback
 */
export async function fetchLtcUsdPrice(): Promise<string> {
  const now = Date.now();
  if (cachedLtcPriceUsd && now - cachedLtcPriceUsd.timestamp < PRICE_CACHE_TTL) {
    return cachedLtcPriceUsd.price;
  }

  // Tier 1: CoinGecko
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd',
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data?.litecoin?.usd) {
        const price = new Decimal(data.litecoin.usd).toString();
        cachedLtcPriceUsd = { price, timestamp: now };
        return price;
      }
    }
  } catch (err) {
    console.warn('Price Oracle Tier 1 (CoinGecko) failed, switching to Tier 2:', err);
  }

  // Tier 2: CryptoCompare
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      'https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD',
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data?.USD) {
        const price = new Decimal(data.USD).toString();
        cachedLtcPriceUsd = { price, timestamp: now };
        return price;
      }
    }
  } catch (err) {
    console.warn('Price Oracle Tier 2 (CryptoCompare) failed:', err);
  }

  // Tier 3: Fallback
  return cachedLtcPriceUsd?.price || '88.50';
}

/**
 * Connect to 4 Litecoin Blockchain Explorers in priority order
 * to detect unconfirmed (0-conf) and confirmed transactions.
 */
export async function queryLtcAddressTransactions(
  address: string
): Promise<LtcTxResult[]> {
  const results: LtcTxResult[] = [];

  // Engine 1: Litecoin Space (mempool 0-conf detection)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://litecoinspace.org/api/address/${address}/txs`,
      { signal: controller.signal, next: { revalidate: 5 } }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const txs = await res.json();
      if (Array.isArray(txs)) {
        for (const tx of txs) {
          let outputValueSats = new Decimal(0);
          for (const vout of tx.vout || []) {
            if (vout.scriptpubkey_address === address) {
              outputValueSats = outputValueSats.plus(vout.value || 0);
            }
          }

          if (outputValueSats.isPositive()) {
            const amountLtc = outputValueSats.dividedBy(100000000).toFixed(6);
            const is0Conf = !tx.status?.confirmed;
            const blockTime = tx.status?.block_time || Math.floor(Date.now() / 1000);

            results.push({
              txHash: tx.txid,
              amountLtc,
              confirmations: is0Conf ? 0 : 1,
              timestamp: blockTime * 1000,
              isMempool0Conf: is0Conf,
            });
          }
        }
        if (results.length > 0) return results;
      }
    }
  } catch (err) {
    console.warn('Engine 1 (Litecoin Space) query failed:', err);
  }

  // Engine 2: Bitaps Engine
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://api.bitaps.com/ltc/v1/blockchain/address/transactions/${address}?limit=10`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const list = data?.data?.list || [];
      for (const item of list) {
        if (item.amount > 0) {
          const amountLtc = new Decimal(item.amount).dividedBy(100000000).toFixed(6);
          results.push({
            txHash: item.txId,
            amountLtc,
            confirmations: item.confirmations || 0,
            timestamp: (item.time || Math.floor(Date.now() / 1000)) * 1000,
            isMempool0Conf: (item.confirmations || 0) === 0,
          });
        }
      }
      if (results.length > 0) return results;
    }
  } catch (err) {
    console.warn('Engine 2 (Bitaps) query failed:', err);
  }

  // Engine 3: BlockCypher Engine
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/full?limit=10`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      for (const tx of data.txs || []) {
        for (const out of tx.outputs || []) {
          if (out.addresses && out.addresses.includes(address)) {
            const amountLtc = new Decimal(out.value).dividedBy(100000000).toFixed(6);
            results.push({
              txHash: tx.hash,
              amountLtc,
              confirmations: tx.confirmations || 0,
              timestamp: tx.received ? new Date(tx.received).getTime() : Date.now(),
              isMempool0Conf: (tx.confirmations || 0) === 0,
            });
          }
        }
      }
      if (results.length > 0) return results;
    }
  } catch (err) {
    console.warn('Engine 3 (BlockCypher) query failed:', err);
  }

  return results;
}
