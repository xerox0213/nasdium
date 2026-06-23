import { createHash, randomBytes } from "node:crypto";

import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTS,
  ACCESS_TOKEN_TTL_S,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTS,
} from "@/shared/constants/auth.const";

export const createAccessToken = async (userId: number) => {
  const accessToken = await sign(
    {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_S,
    },
    process.env.JWT_SECRET,
  );

  return accessToken;
};

export const createAccessTokenCookie = (c: Context, accessToken: string) => {
  setCookie(c, ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_OPTS);
};

export const createRefreshToken = () => {
  return randomBytes(32).toString("hex");
};

export const createRefreshTokenCookie = (c: Context, refreshToken: string) => {
  setCookie(
    c,
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    REFRESH_TOKEN_COOKIE_OPTS,
  );
};

export const hashRefreshToken = (refreshToken: string) => {
  return createHash("sha256").update(refreshToken).digest("hex");
};
