import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không hợp lệ (tối thiểu 6 ký tự)' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email này đã được đăng ký tài khoản' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name ? name.trim() : cleanEmail.split('@')[0],
        email: cleanEmail,
        passwordHash,
        role: 'USER',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi đăng ký tài khoản' },
      { status: 500 }
    );
  }
}
