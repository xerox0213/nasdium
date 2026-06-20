import "@tanstack/vue-query";

declare module "@tanstack/vue-query" {
  interface Register {
    // Use unknown so call sites must narrow explicitly.
    defaultError: unknown;
  }
}
