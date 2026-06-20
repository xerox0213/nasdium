import { Hono } from "hono";
import { cors } from "hono/cors";

import auth from "./features/auth/auth.route";
import users from "./features/users/users.route";

const app = new Hono()
  .use(
    "/*",
    cors({
      origin: process.env.FRONTEND_ORIGIN,
      credentials: true,
    }),
  )
  .route("/", auth)
  .route("/", users);

export type AppType = typeof app;

export default app;
