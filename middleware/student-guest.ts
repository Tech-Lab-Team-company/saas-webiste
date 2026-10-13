import { useUserStore } from "~/stores/user";
import { consumeAuthRedirect } from "~/utils/authRedirect";

export default defineNuxtRouteMiddleware((to) => {
  // The persisted-state plugin hydrates the store when it is first created.
  // The website origin redirects here even when a student has a saved token.
  if (!useUserStore().user?.apiToken) return;

  const redirect = consumeAuthRedirect(to.query.redirect);
  // Returning to the origin would redirect straight back to this login page.
  const target = redirect && redirect.split(/[?#]/u)[0] !== "/"
    ? redirect
    : "/student-dashboard";

  return navigateTo(target, { replace: true });
});
