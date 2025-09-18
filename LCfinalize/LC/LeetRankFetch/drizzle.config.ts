import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not found. Database operations will be disabled until a database is provisioned.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
