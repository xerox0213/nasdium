import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: process.env.DB_URL,
  casing: "snake_case",
});
