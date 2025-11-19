import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  const materials = await prisma.material.findMany({
    orderBy: { id: "asc" },
    select: { code: true, name: true, unit: true },
  });

  const header = ["code", "name", "unit"];

  const data = [
    header,
    ...materials.map((m) => [m.code ?? "", m.name, m.unit]),
  ];

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, sheet, "Materials");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="materials.xlsx"',
    },
  });
}
