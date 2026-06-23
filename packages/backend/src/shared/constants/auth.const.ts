import type { CookieOptions } from "hono/utils/cookie";

const TOKEN_BASE_COOKIE_OPTS: CookieOptions = {
  secure: true,
  sameSite: "Strict",
  httpOnly: true,
  domain: process.env.COOKIE_DOMAIN,
  path: "/",
};

// Access token
export const ACCESS_TOKEN_COOKIE_NAME = "access_token";
export const ACCESS_TOKEN_TTL_S = 5 * 60; // 5 min
export const ACCESS_TOKEN_COOKIE_OPTS: CookieOptions = {
  ...TOKEN_BASE_COOKIE_OPTS,
  maxAge: ACCESS_TOKEN_TTL_S,
};

// Refresh token
export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
export const REFRESH_TOKEN_TTL_S = 60 * 60 * 24 * 7; // 7 days
export const REFRESH_TOKEN_COOKIE_OPTS: CookieOptions = {
  ...TOKEN_BASE_COOKIE_OPTS,
  maxAge: REFRESH_TOKEN_TTL_S,
};
