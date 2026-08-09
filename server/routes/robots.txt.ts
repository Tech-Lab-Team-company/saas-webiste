export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event);
  const sitemapUrl = new URL("/sitemap.xml", requestUrl.origin).toString();

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
