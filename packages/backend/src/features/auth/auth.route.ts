import { sValidator } from "@hono/standard-validator";
import { loginSchema, registerSchema } from "@nasdium/shared/schemas";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

import { db } from "@/core/db";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTS,
} from "@/shared/constants/auth.const";
import { refreshTokensTable } from "@/tables/auth.table";
import { usersTable } from "@/tables/users.table";

import {
  createAccessToken,
  createAccessTokenCookie,
  createRefreshToken,
  createRefreshTokenCookie,
  hashRefreshToken,
} from "./auth.service";

const app = new Hono()
  .post("/register", sValidator("json", registerSchema), async (c) => {
    const user = c.req.valid("json");

    const hashedPassword = await Bun.password.hash(user.password);

    const inserted = await db
      .insert(usersTable)
      .values({ ...user, password: hashedPassword })
      .onConflictDoNothing({ target: usersTable.email })
      .returning();

    if (inserted.length == 0) {
      throw new HTTPException(409);
    }

    return c.body(null, 201);
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
      throw new HTTPException(401);
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
  })
  .post("/refresh", async (c) => {
    const refreshTokenCookie = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);

    if (!refreshTokenCookie) {
      throw new HTTPException(401);
    }

    const refreshTokenCookieHashed = hashRefreshToken(refreshTokenCookie);

    const [refreshToken] = await db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.hash, refreshTokenCookieHashed));

    if (!refreshToken) {
      throw new HTTPException(401);
    }

    if (refreshToken.revokedAt != null) {
      await db
        .update(refreshTokensTable)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokensTable.userId, refreshToken.userId));

      throw new HTTPException(401);
    }

    if (refreshToken.expiresAt <= new Date()) {
      throw new HTTPException(401);
    }

    const accessToken = await createAccessToken(refreshToken.userId);

    const newRefreshToken = await db.transaction(async (tx) => {
      const newRefreshToken = createRefreshToken();

      const newRefreshTokenHashed = hashRefreshToken(newRefreshToken);

      await tx
        .insert(refreshTokensTable)
        .values({ hash: newRefreshTokenHashed, userId: refreshToken.userId });

      await tx
        .update(refreshTokensTable)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokensTable.id, refreshToken.id));

      return newRefreshToken;
    });

    createAccessTokenCookie(c, accessToken);

    createRefreshTokenCookie(c, newRefreshToken);

    return c.body(null, 204);
  })
  .delete("/logout", async (c) => {
    const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);

    if (refreshToken != undefined) {
      await db
        .update(refreshTokensTable)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokensTable.hash, hashRefreshToken(refreshToken)));

      deleteCookie(c, REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTS);
    }

    deleteCookie(c, ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_COOKIE_OPTS);

    return c.body(null, 204);
  });

export default app;
