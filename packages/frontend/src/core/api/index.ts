import { hcWithType } from "@nasdium/backend";

import { HttpError } from "@/shared/errors/http-error";

import { router } from "../router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const customFetch: typeof fetch = async (input, init) => {
  let res = await fetch(input, init);

  const url = input.toString();

  const isAuthEndpoint =
    url.endsWith("/register") ||
    url.endsWith("/login") ||
    url.endsWith("/refresh");

  if (res.status == 401 && !isAuthEndpoint) {
    const refreshRes = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      router.push({ name: "login" });
    } else {
      res = await fetch(input, init);
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => undefined);
    throw new HttpError(res.status, data);
  }

  return res;
};

export const api = hcWithType(BASE_URL, {
  init: {
    credentials: "include",
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  fetch: customFetch,
});
