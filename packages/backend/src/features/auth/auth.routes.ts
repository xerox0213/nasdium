import { sValidator } from "@hono/standard-validator";
import { loginSchema, registerSchema } from "@nasdium/shared/schemas";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "@/core/db";
import { refreshTokensTable } from "@/tables/auth.table";
import { usersTable } from "@/tables/users.table";

import {
  createAccessToken,
  createAccessTokenCookie,
  createRefreshToken,
  createRefreshTokenCookie,
  hashRefreshToken,
} from "./auth.service";

const app = new Hono();

app
  .post("/register", sValidator("json", registerSchema), async (c) => {
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
  })
  .post("/login", sValidator("json", loginSchema), async (c) => {
    const credentials = c.req.valid("json");

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, credentials.email))
      .limit(1);

    const isValid =
      user != undefined &&
      (await Bun.password.verify(credentials.password, user.password));

    if (!isValid) {
      return c.json({ message: "Invalid email or password" }, 401);
    }

    const accessToken = await createAccessToken(user.id);

    createAccessTokenCookie(c, accessToken);

    const refreshToken = createRefreshToken();

    const refreshTokenHashed = hashRefreshToken(refreshToken);

    await db
      .insert(refreshTokensTable)
      .values({ hash: refreshTokenHashed, userId: user.id });

    createRefreshTokenCookie(c, refreshToken);

    return c.body(null, 204);
  });

export default app;
