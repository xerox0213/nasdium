import { Hono } from "hono";

import auth from "./features/auth/auth.routes";

const app = new Hono();

app.route("/", auth);

export default app;
