import { Hono } from "hono";
import { cors } from "hono/cors";

import auth from "./features/auth/auth.routes";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.route("/", auth);

export default app;
