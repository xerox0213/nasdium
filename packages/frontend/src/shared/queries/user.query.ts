import { queryOptions } from "@tanstack/vue-query";

import { api } from "@/core/api";

export const userQueries = {
  base: () => ["user"],

  me: () =>
    queryOptions({
      queryKey: [...userQueries.base(), "me"],
      queryFn: async () => {
        const res = await api.me.$get();
        return res.json();
      },
      retry: (failureCount, error) => {
        if (error instanceof Response && error.status === 401) return false;

        return failureCount < 3;
      },
    }),
};
