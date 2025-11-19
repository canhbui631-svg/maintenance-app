// app/api/areas/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // Trả rõ các field (có id)
  const areas = await prisma.area.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      name: true,
      roads: true,
      hamlets: true,
    },
  });

  return NextResponse.json({ ok: true, areas });
}

export async function POST(request: Request) {
  try {
    const { name, roads, hamlets } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { ok: false, message: "Thiếu tên khu vực" },
        { status: 400 }
      );
    }

    const area = await prisma.area.create({
      data: {
        name: name.trim(),
        roads: roads ?? "",
        hamlets: hamlets ?? "",
      },
      select: {
        id: true,
        name: true,
        roads: true,
        hamlets: true,
      },
    });

    return NextResponse.json({ ok: true, area });
  } catch (error) {
    console.error("Error creating area:", error);
    return NextResponse.json(
      { ok: false, message: "Lỗi tạo khu vực" },
      { status: 500 }
    );
  }
}
