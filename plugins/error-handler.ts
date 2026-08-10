export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.dev) return;

  nuxtApp.hook("vue:error", (error, _instance, info) => {
    console.error("[vue:error]", error, info);
  });
});
