import { Hono } from "hono";
import { cors } from "hono/cors";

import auth from "./features/auth/auth.routes";

const app = new Hono()
  .use(
    "/*",
    cors({
      origin: process.env.FRONTEND_ORIGIN,
      credentials: true,
    }),
  )
  .route("/", auth);

export type AppType = typeof app;

export default app;
