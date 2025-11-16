// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const ROLES = ["admin", "team_lead", "technician", "guest"] as const;

// GET /api/users
export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    include: {
      areas: {
        include: { area: true },
      },
    },
  });

  return NextResponse.json({
    ok: true,
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role,
      createdAt: u.createdAt,
      areas: u.areas.map((a) => ({
        id: a.area.id,
        name: a.area.name,
      })),
    })),
  });
}

// POST /api/users
export async function POST(req: NextRequest) {
  const { name, username, password, role, areaIds } = await req.json();

  if (!name || !username || !password || !role) {
    return NextResponse.json(
      { ok: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!ROLES.includes(role)) {
    return NextResponse.json(
      { ok: false, message: "Invalid role" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json(
      { ok: false, message: "Username already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      password: passwordHash,
      role,
      areas: areaIds?.length
        ? {
            create: areaIds.map((areaId: number) => ({
              area: { connect: { id: areaId } },
            })),
          }
        : undefined,
    },
    include: {
      areas: { include: { area: true } },
    },
  });

  return NextResponse.json(
    {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        areas: user.areas.map((a) => ({
          id: a.area.id,
          name: a.area.name,
        })),
      },
    },
    { status: 201 }
  );
}
