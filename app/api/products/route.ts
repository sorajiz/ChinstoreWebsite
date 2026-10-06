import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runExpirationSweep } from '@/lib/expiration-worker';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Passive sweep of any expired reservations
    await runExpirationSweep();

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'popular';
    const inStock = searchParams.get('inStock') === 'true';

    const where: any = {};

    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') {
      orderBy = { priceVND: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { priceVND: 'desc' };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        stocks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    let parsedProducts = products.map((prod) => {
      const availableStocks = prod.stocks.filter((s) => s.status === 'AVAILABLE');
      return {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        priceVND: prod.priceVND,
        price: prod.priceVND,
        images: JSON.parse(prod.images || '[]'),
        warrantyPolicy: prod.warrantyPolicy,
        categoryId: prod.categoryId,
        category: prod.category,
        stocks: prod.stocks,
        availableCount: availableStocks.length,
        createdAt: prod.createdAt.toISOString(),
      };
    });

    if (inStock) {
      parsedProducts = parsedProducts.filter((p) => p.availableCount > 0);
    }

    return NextResponse.json({ success: true, data: parsedProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
