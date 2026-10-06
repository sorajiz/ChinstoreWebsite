import { NextResponse } from 'next/server';
import { getLtcRate } from '@/lib/rates';
import { USD_RATE } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ltcRate = await getLtcRate();
    return NextResponse.json({
      success: true,
      data: {
        ltcVnd: ltcRate.ltcVnd,
        ltcUsd: ltcRate.ltcUsd,
        usdVnd: USD_RATE,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rates' },
      { status: 500 }
    );
  }
}
