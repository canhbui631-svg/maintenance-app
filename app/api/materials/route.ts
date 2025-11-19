// app/api/materials/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const materials = await prisma.material.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      code: true,
      name: true,
      unit: true,
    },
  });

  return NextResponse.json({ ok: true, materials });
}

export async function POST(request: Request) {
  try {
    const { code, name, unit } = await request.json();

    const nameTrim = String(name || "").trim();
    const unitTrim = String(unit || "").trim();
    const codeTrim = String(code || "").trim();

    if (!nameTrim || !unitTrim) {
      return NextResponse.json(
        { ok: false, message: "Thiếu tên vật tư hoặc đơn vị." },
        { status: 400 }
      );
    }

    // 🔍 Kiểm tra trùng theo:
    // 1. Mã vật tư (nếu có)
    // 2. Tên + đơn vị
    const conditions: any[] = [
      {
        AND: [{ name: nameTrim }, { unit: unitTrim }],
      },
    ];

    if (codeTrim) {
      conditions.push({ code: codeTrim });
    }

    const existed = await prisma.material.findFirst({
      where: {
        OR: conditions,
      },
      select: {
        id: true,
        code: true,
        name: true,
        unit: true,
      },
    });

    if (existed) {
      let reason = "";
      if (codeTrim && existed.code === codeTrim) {
        reason = `Trùng mã vật tư (${codeTrim}).`;
      } else if (
        existed.name === nameTrim &&
        existed.unit === unitTrim
      ) {
        reason = `Trùng tên + đơn vị (${nameTrim} - ${unitTrim}).`;
      } else {
        reason = "Vật tư đã tồn tại.";
      }

      return NextResponse.json(
        {
          ok: false,
          code: "DUPLICATE_MATERIAL",
          message: reason,
        },
        { status: 409 }
      );
    }

    const material = await prisma.material.create({
      data: {
        code: codeTrim || null,
        name: nameTrim,
        unit: unitTrim,
      },
      select: {
        id: true,
        code: true,
        name: true,
        unit: true,
      },
    });

    return NextResponse.json({ ok: true, material });
  } catch (error) {
    console.error("Error creating material:", error);
    return NextResponse.json(
      { ok: false, message: "Lỗi tạo vật tư." },
      { status: 500 }
    );
  }
}
