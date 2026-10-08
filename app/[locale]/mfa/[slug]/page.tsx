import React from 'react';
import { notFound } from 'next/navigation';
import { getMfaAccountBySlug, MFA_ACCOUNTS_DATA } from '@/lib/mfa-data';
import MfaDetailPageClient from '@/components/shop/MfaDetailPageClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function MfaDirectPage({ params }: PageProps) {
  const account = getMfaAccountBySlug(params.slug) || MFA_ACCOUNTS_DATA[4];

  if (!account) {
    notFound();
  }

  return <MfaDetailPageClient account={account} />;
}
