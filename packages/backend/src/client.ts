import { hc } from "hono/client";

import type { AppType } from "./main";

// this is a trick to calculate the type when compiling
export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);

export type { InferRequestType, InferResponseType } from "hono/client";
