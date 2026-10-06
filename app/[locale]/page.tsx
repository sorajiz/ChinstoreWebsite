import React from 'react';
import LandingPageClient from '@/components/landing/LandingPageClient';
import { runExpirationSweep } from '@/lib/expiration-worker';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Run passive expiration sweep in background
  await runExpirationSweep();

  return <LandingPageClient />;
}
