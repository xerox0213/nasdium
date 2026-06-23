import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { db } from "@/core/db";
import { authMiddleware } from "@/middlewares/auth.middleware";
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

  if (!user) throw new HTTPException(401);

  return c.json(user);
});

export default app;
