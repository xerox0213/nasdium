import { QueryClient, type VueQueryPluginOptions } from "@tanstack/vue-query";

export const queryClient = new QueryClient();

export const queryPluginOptions: VueQueryPluginOptions = {
  queryClient,
};
