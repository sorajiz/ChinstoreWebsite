// In-memory cache for crypto rates
let cachedRate: {
  ltcVnd: number;
  ltcUsd: number;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 1000; // 1 minute cache
const FALLBACK_LTC_VND = 2250000; // ~88 USD * 25,400 VND
const FALLBACK_LTC_USD = 88.5;

export async function getLtcRate(): Promise<{ ltcVnd: number; ltcUsd: number }> {
  const now = Date.now();
  if (cachedRate && now - cachedRate.timestamp < CACHE_DURATION) {
    return { ltcVnd: cachedRate.ltcVnd, ltcUsd: cachedRate.ltcUsd };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=vnd,usd',
      {
        signal: controller.signal,
        next: { revalidate: 60 },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.litecoin?.vnd && data?.litecoin?.usd) {
        cachedRate = {
          ltcVnd: Number(data.litecoin.vnd),
          ltcUsd: Number(data.litecoin.usd),
          timestamp: now,
        };
        return { ltcVnd: cachedRate.ltcVnd, ltcUsd: cachedRate.ltcUsd };
      }
    }
  } catch (error) {
    console.warn('CoinGecko API rate fetch failed, using fallback/cached rate:', error);
  }

  return {
    ltcVnd: cachedRate?.ltcVnd || FALLBACK_LTC_VND,
    ltcUsd: cachedRate?.ltcUsd || FALLBACK_LTC_USD,
  };
}
