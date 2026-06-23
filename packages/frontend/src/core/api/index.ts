import { hcWithType } from "@nasdium/backend";

import { router } from "../router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Single-flight: concurrent 401s share one /refresh. With token rotation,
// a second refresh would replay an already-rotated token → reuse detection
// → full logout.
let refreshTokenPromise: Promise<Response> | null = null;

const customFetch: typeof fetch = async (input, init) => {
  let res = await fetch(input, init);

  const url = input.toString();

  const isAuthEndpoint =
    url.endsWith("/register") ||
    url.endsWith("/login") ||
    url.endsWith("/refresh");

  if (res.status == 401 && !isAuthEndpoint) {
    if (!refreshTokenPromise) {
      refreshTokenPromise = fetch(`${BASE_URL}/refresh`, {
        method: "POST",
        credentials: "include",
      }).finally(() => {
        refreshTokenPromise = null;
      });
    }

    const refreshRes = await refreshTokenPromise;

    const canRedirect = !url.endsWith("/me");

    if (!refreshRes.ok && canRedirect) {
      router.push({ name: "login" });
    } else if (refreshRes.ok) {
      res = await fetch(input, init);
    }
  }

  if (!res.ok) throw res;

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
