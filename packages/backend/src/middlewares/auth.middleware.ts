import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";
import * as z from "zod";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth.const";

const jwtMiddleware = jwt({
  alg: "HS256",
  secret: process.env.JWT_SECRET,
  cookie: ACCESS_TOKEN_COOKIE_NAME,
});

const jwtPayloadSchema = z.object({ sub: z.number() });

export const authMiddleware = createMiddleware<{
  Variables: { userId: number };
}>(async (c, next) => {
  const fakeNext = async () => {};

  await jwtMiddleware(c, fakeNext);

  const result = jwtPayloadSchema.safeParse(c.get("jwtPayload"));

  if (!result.success) {
    throw new HTTPException(401, { message: "Invalid token payload" });
  }

  const jwtPayload = result.data;

  c.set("userId", jwtPayload.sub);

  await next();
});
