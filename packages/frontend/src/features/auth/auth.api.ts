import type { InferRequestType } from "hono/client";

import { api } from "@/core/api";

// Register

export type RegisterInput = InferRequestType<typeof api.register.$post>["json"];

export const register = async (credentials: RegisterInput) => {
  return api.register.$post({ json: credentials });
};

// Login

export type LoginInput = InferRequestType<typeof api.login.$post>["json"];

export const login = async (credentials: LoginInput) => {
  return api.login.$post({ json: credentials });
};
