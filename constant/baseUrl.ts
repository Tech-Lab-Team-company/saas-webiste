// constant/baseUrl.ts

export const useBaseUrls = () => {
  const config = useRuntimeConfig();

  const baseUrl =
    String(config.public.baseUrl || "").trim() ||
    "https://dev.saas.techlabeg.com/api/website";

  const dashboardBaseUrl =
    String(config.public.dashboardBaseUrl || "").trim() ||
    "https://dev.saas.techlabeg.com/api/dashboard";

  return {
    baseUrl,
    dashboardBaseUrl,
  };
};