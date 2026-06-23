import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/tables/",
  dialect: "sqlite",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
