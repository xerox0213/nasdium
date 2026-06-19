import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { REFRESH_TOKEN_TTL_S } from "@/shared/constants/auth.const";

import { usersTable } from "./users.table";

export const refreshTokensTable = sqliteTable("refresh_tokens", {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  hash: text().notNull().unique(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  expiresAt: integer({ mode: "timestamp" })
    .notNull()
    .$default(() => new Date(Date.now() + REFRESH_TOKEN_TTL_S * 1000)),
  revokedAt: integer({ mode: "timestamp" }),
});
