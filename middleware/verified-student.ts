import EmailBuilder from "~/features/VerifyCodeFeature/presentation/builder/email_builder";
import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const user = userStore.user;

  if (!user?.apiToken) {
    return navigateTo({
      name: "login-loginhome",
      query: { redirect: to.fullPath },
      replace: true,
    });
  }

  // const isVerified = user.isVerified === true || Number(user.isVerified) === 1;
  // if (!isVerified) {
  //   EmailBuilder.Instance.setEmail(user.phone || user.email || null);
  //   return navigateTo({
  //     name: "verify-account-otp",
  //     query: { source: "login" },
  //   });
  // }
});
