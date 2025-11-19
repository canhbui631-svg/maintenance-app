// app/api/materials/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, message: "Không có file upload." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      return NextResponse.json(
        { ok: false, message: "File không có dữ liệu." },
        { status: 400 }
      );
    }

    // Lấy dữ liệu hiện có trong DB để check trùng
    const existing = await prisma.material.findMany({
      select: { code: true, name: true, unit: true },
    });

    const existingCodes = new Set(
      existing
        .map((m) => m.code?.toLowerCase())
        .filter((c): c is string => !!c)
    );

    const existingKeys = new Set(
      existing.map((m) =>
        `${m.name.toLowerCase()}||${m.unit.toLowerCase()}`
      )
    );

    const fileCodes = new Set<string>();
    const fileKeys = new Set<string>();

    const dataToInsert: { code: string | null; name: string; unit: string }[] =
      [];
    const duplicateRows: string[] = [];
    const invalidRows: string[] = [];

    rows.forEach((row, index) => {
      const rowIndex = index + 2; // tính từ dòng 2 trong Excel (dòng 1 là header)

      const rawCode =
        row.code || row.Code || row["Mã"] || row["ma"] || row["MA"] || "";
      const rawName =
        row.name ||
        row.Name ||
        row["Tên vật tư"] ||
        row["ten"] ||
        row["TEN"] ||
        "";
      const rawUnit =
        row.unit || row.Unit || row["Đơn vị"] || row["donvi"] || row["DONVI"] || "";

      const name = String(rawName).trim();
      const unit = String(rawUnit).trim();
      const code = String(rawCode).trim();

      if (!name || !unit) {
        invalidRows.push(`Dòng ${rowIndex}: thiếu name/unit.`);
        return;
      }

      const key = `${name.toLowerCase()}||${unit.toLowerCase()}`;

      let isDuplicate = false;
      let reason = "";

      if (code) {
        const codeLower = code.toLowerCase();
        if (existingCodes.has(codeLower)) {
          isDuplicate = true;
          reason = `trùng mã với DB (${code}).`;
        } else if (fileCodes.has(codeLower)) {
          isDuplicate = true;
          reason = `trùng mã với dòng khác trong file (${code}).`;
        }
        if (!isDuplicate) {
          fileCodes.add(codeLower);
        }
      }

      if (!isDuplicate) {
        if (existingKeys.has(key)) {
          isDuplicate = true;
          reason = `trùng tên + đơn vị với DB (${name} - ${unit}).`;
        } else if (fileKeys.has(key)) {
          isDuplicate = true;
          reason = `trùng tên + đơn vị với dòng khác trong file (${name} - ${unit}).`;
        }
      }

      if (isDuplicate) {
        duplicateRows.push(`Dòng ${rowIndex}: ${reason}`);
        return;
      }

      fileKeys.add(key);
      dataToInsert.push({
        code: code || null,
        name,
        unit,
      });
    });

    if (!dataToInsert.length) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Không có dòng hợp lệ để import (tất cả đều trùng hoặc thiếu dữ liệu).",
          invalidRows,
          duplicateRows,
        },
        { status: 400 }
      );
    }

    await prisma.material.createMany({
      data: dataToInsert,
    });

    return NextResponse.json({
      ok: true,
      message: `Đã import ${dataToInsert.length} dòng. Bỏ qua ${duplicateRows.length} dòng trùng và ${invalidRows.length} dòng lỗi.`,
      inserted: dataToInsert.length,
      duplicateRows,
      invalidRows,
    });
  } catch (err) {
    console.error("Import materials error:", err);
    return NextResponse.json(
      { ok: false, message: "Lỗi import vật tư." },
      { status: 500 }
    );
  }
}
