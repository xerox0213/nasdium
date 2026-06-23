import { type NavigationGuard } from "vue-router";

import { userQueries } from "@/shared/queries/user.query";

import { queryClient } from "../query";

export const authGuard: NavigationGuard = async (to, from) => {
  const isFromAuthPage = from.name == "register" || from.name == "login";

  const isToAuthPage = to.name == "register" || to.name == "login";

  if (!to.meta.requiresAuth && (!isToAuthPage || isFromAuthPage)) return;

  try {
    await queryClient.ensureQueryData(userQueries.me());

    if (isToAuthPage) return { name: "home" };
  } catch {
    if (isToAuthPage) return;

    return { name: "login" };
  }
};
