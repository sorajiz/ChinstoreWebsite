import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decryptAccountData } from '@/lib/crypto-vault';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(userEmail ? [{ customerEmail: userEmail }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        stock: true,
      },
    });

    const parsedOrders = orders.map((ord) => {
      let decryptedData: string | null = null;
      if (ord.status === 'PAID' && ord.stock) {
        try {
          decryptedData = decryptAccountData(
            ord.stock.encryptedData,
            ord.stock.iv,
            ord.stock.authTag
          );
        } catch (e) {
          decryptedData = 'Lỗi giải mã';
        }
      }

      return {
        id: ord.id,
        orderCode: ord.orderCode,
        totalVND: ord.totalVND,
        totalLTC: ord.totalLTC,
        gateway: ord.gateway,
        status: ord.status,
        reviewReason: ord.reviewReason,
        createdAt: ord.createdAt.toISOString(),
        items: ord.items.map((i) => ({
          productName: i.product.name,
          priceVND: i.priceVND,
          quantity: i.quantity,
          warrantyPolicy: i.product.warrantyPolicy,
        })),
        decryptedData,
      };
    });

    return NextResponse.json({ success: true, data: parsedOrders });
  } catch (error: any) {
    console.error('User orders fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
