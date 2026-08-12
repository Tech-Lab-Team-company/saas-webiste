import { buildAbsoluteSiteUrl, resolveSiteOrigin } from "~/utils/siteUrl";

export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event);
  const runtimeConfig = useRuntimeConfig(event);
  const configuredSiteUrl = String(runtimeConfig.public.siteUrl || "").trim();
  const siteOrigin = resolveSiteOrigin(configuredSiteUrl, requestUrl.origin);
  const sitemapUrl = buildAbsoluteSiteUrl(siteOrigin, "/sitemap.xml");

  setResponseHeaders(event, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  });

  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /Auth/",
    "Disallow: /login/",
    "Disallow: /profile",
    "Disallow: /student-dashboard",
    "Disallow: /questions",
    "Disallow: /exams",
    "Disallow: /passwordupdate",
    "Disallow: /paymentverify/",
    "",
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");
});
