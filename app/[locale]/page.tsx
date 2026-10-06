import React from 'react';
import { prisma } from '@/lib/prisma';
import LandingPageClient from '@/components/landing/LandingPageClient';
import { runExpirationSweep } from '@/lib/expiration-worker';
import { Product, Category } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Passive sweep of expired reservations
  await runExpirationSweep();

  const [categoriesData, productsData] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        stocks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    }),
  ]);

  const categories: Category[] = categoriesData.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
  }));

  const products: Product[] = productsData.map((p) => {
    const availableStocks = p.stocks.filter((s) => s.status === 'AVAILABLE');
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      priceVND: p.priceVND,
      price: p.priceVND,
      images: JSON.parse(p.images || '[]'),
      warrantyPolicy: p.warrantyPolicy,
      categoryId: p.categoryId,
      category: p.category
        ? {
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
            icon: p.category.icon,
          }
        : undefined,
      availableCount: availableStocks.length,
      createdAt: p.createdAt.toISOString(),
    };
  });

  return (
    <LandingPageClient
      initialCategories={categories}
      initialProducts={products}
    />
  );
}
