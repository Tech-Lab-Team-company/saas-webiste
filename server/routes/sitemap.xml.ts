import { HomePageApi } from "~/features/HomePageFeature/api/homePageApi";
import {
  mapBlogsPage,
  mapBooksPage,
} from "~/features/HomePageFeature/mappers/homePageMapper";

type SitemapEntry = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  lastmod?: string;
};

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: 1 },
  { path: "/course", changefreq: "daily", priority: 0.9 },
  { path: "/books", changefreq: "weekly", priority: 0.8 },
  { path: "/blogs", changefreq: "daily", priority: 0.8 },
  { path: "/about-teacher", changefreq: "monthly", priority: 0.7 },
  { path: "/app", changefreq: "monthly", priority: 0.6 },
  { path: "/fqs", changefreq: "monthly", priority: 0.5 },
  { path: "/privacy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms", changefreq: "yearly", priority: 0.3 },
];

const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const normalizeLastModified = (value: string | null): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export default defineEventHandler(async (event) => {
  const requestUrl = getRequestURL(event);
  const runtimeConfig = useRuntimeConfig(event);
  const configuredUrl = String(runtimeConfig.public.webLink || "").trim();
  let siteOrigin = requestUrl.origin;

  if (configuredUrl) {
    try {
      siteOrigin = new URL(
        configuredUrl.includes("://") ? configuredUrl : `https://${configuredUrl}`,
      ).origin;
    } catch {
      siteOrigin = requestUrl.origin;
    }
  }

  const webDomain = new URL(siteOrigin).hostname;
  const api = new HomePageApi(webDomain);
  const [blogsResult, booksResult] = await Promise.allSettled([
    api.fetchBlogs(),
    api.fetchBooks(1),
  ]);

  const dynamicEntries: SitemapEntry[] = [];

  if (blogsResult.status === "fulfilled") {
    for (const blog of mapBlogsPage(blogsResult.value)) {
      if (blog.route === "/blogs") continue;
      dynamicEntries.push({
        path: blog.route,
        changefreq: "monthly",
        priority: 0.7,
        ...(normalizeLastModified(blog.date)
          ? { lastmod: normalizeLastModified(blog.date) }
          : {}),
      });
    }
  }

  if (booksResult.status === "fulfilled") {
    for (const book of mapBooksPage(booksResult.value).items) {
      dynamicEntries.push({
        path: `/books/${book.bookId}`,
        changefreq: "monthly",
        priority: 0.7,
      });
    }
  }

  const uniqueEntries = [...staticEntries, ...dynamicEntries].filter(
    (entry, index, entries) =>
      entries.findIndex((candidate) => candidate.path === entry.path) === index,
  );
  const urls = uniqueEntries.map((entry) => {
    const location = new URL(entry.path, siteOrigin).toString();
    return [
      "  <url>",
      `    <loc>${escapeXml(location)}</loc>`,
      ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n");
  });

  setResponseHeaders(event, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
});
