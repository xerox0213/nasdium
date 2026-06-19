import { sValidator } from "@hono/standard-validator";
import { registerSchema } from "@nasdium/shared/schemas";
import { Hono } from "hono";

import { db } from "@/core/db";
import { usersTable } from "@/tables/users.table";

const app = new Hono();

app.post("/register", sValidator("json", registerSchema), async (c) => {
  const user = c.req.valid("json");

  const hashedPassword = await Bun.password.hash(user.password);

  const inserted = await db
    .insert(usersTable)
    .values({ ...user, password: hashedPassword })
    .onConflictDoNothing({ target: usersTable.email })
    .returning();

  if (inserted.length == 0) {
    return c.json({ message: "Email already exists" }, 409);
  }

  return c.json({ message: "Registered" }, 201);
});

export default app;
