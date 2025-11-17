// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Thiếu tài khoản hoặc mật khẩu" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Sai tài khoản hoặc mật khẩu" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Sai tài khoản hoặc mật khẩu" },
        { status: 401 }
      );
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role as any,
    };

    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("LOGIN_ERROR", err);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi đăng nhập" },
      { status: 500 }
    );
  }
}
