import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "@/core/db";
import { authMiddleware } from "@/middleware/auth.middleware";
import { usersTable } from "@/tables/users.table";

const app = new Hono().get("/me", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const [user] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!user) return c.notFound();

  return c.json(user);
});

export default app;
