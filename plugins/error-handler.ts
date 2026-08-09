export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.dev) return;

  nuxtApp.hook("vue:error", (error, _instance, info) => {
    // Preserve the original error and stack while developing. Turning every
    // render error into a 404 hides the cause and makes indexable pages emit
    // the global error page's noindex directive.
    console.error("Vue rendering error", { error, info });
  });
});
