// app/api/materials/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const idStr = segments[segments.length - 1];
  const id = Number(idStr);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { ok: false, message: "ID không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    await prisma.material.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { ok: false, message: "Không xoá được vật tư" },
      { status: 500 }
    );
  }
}
