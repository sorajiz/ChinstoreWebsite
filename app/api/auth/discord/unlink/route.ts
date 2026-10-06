import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    // Must have a password or email to unlink Discord so they don't get locked out
    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng thiết lập mật khẩu trước khi hủy liên kết Discord' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        discordId: null,
        discordUsername: null,
        discordAvatar: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Hủy liên kết Discord thành công',
    });
  } catch (error: any) {
    console.error('Unlink Discord error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi hủy liên kết' },
      { status: 500 }
    );
  }
}
