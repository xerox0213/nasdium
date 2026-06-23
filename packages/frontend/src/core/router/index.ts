import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

import { authGuard } from "./guards";

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);
