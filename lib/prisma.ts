// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query", "error", "warn"], // cần thì mở
  });

// tránh tạo nhiều instance khi hot reload trong dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// 👇 quan trọng: default export
export default prisma;
