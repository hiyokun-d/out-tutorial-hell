import "dotenv/config";
import { defineConfig } from "prisma/config";

// DIRECT_URL = non-pooled Supabase URL (for migrations)
// DATABASE_URL = pooled Supabase URL (for app runtime, passed to PrismaClient)
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
