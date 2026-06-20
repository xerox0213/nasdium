import type { InferRequestType } from "hono/client";

import { api } from "@/core/api";

export type RegisterInput = InferRequestType<typeof api.register.$post>["json"];

export const register = async (credentials: RegisterInput) => {
  return api.register.$post({ json: credentials });
};
