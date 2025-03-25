export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:error", (err) => {
    throw createError({
      statusCode: 404,
      statusMessage: 'page not found',
    });
  });
});