import type { AppType } from "@nasdium/backend";
import { hc } from "hono/client";

import { HttpError } from "@/shared/errors/http-error";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const customFetch: typeof fetch = async (input, init) => {
  let res = await fetch(input, init);

  if (!res.ok) {
    const data = await res.json().catch(() => undefined);
    throw new HttpError(res.status, data);
  }

  return res;
};

export const api = hc<AppType>(BASE_URL, {
  init: {
    credentials: "include",
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  fetch: customFetch,
});
