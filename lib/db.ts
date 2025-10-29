import { ENV } from "@/lib/env";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const db = globalForPrisma.prisma || new PrismaClient();

if (ENV.NODE_ENV !== "production") globalForPrisma.prisma = db;
