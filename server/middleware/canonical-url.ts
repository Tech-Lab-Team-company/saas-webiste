const INTERNAL_PATH_PREFIXES = [
  "/_nuxt/",
  "/_ipx/",
  "/api/",
  "/images/",
  "/icons/",
  "/lottie/",
  "/.well-known/",
];

const isDocumentPath = (pathname: string) =>
  !INTERNAL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
  !/\.[a-z0-9]{2,8}$/iu.test(pathname);

export default defineEventHandler((event) => {
  const method = getMethod(event);
  if (method !== "GET" && method !== "HEAD") return;

  const requestUrl = getRequestURL(event);
  if (!isDocumentPath(requestUrl.pathname)) return;

  const forwardedHost = String(
    getRequestHeader(event, "x-forwarded-host") ||
      getRequestHeader(event, "host") ||
      requestUrl.host,
  ).split(",")[0].trim();

  // This repository also serves a standalone Eduhub tenant from static HTML.
  if (forwardedHost.includes("eduhubco.com")) return;

  const runtimeConfig = useRuntimeConfig(event);
  const configuredSiteUrl = String(runtimeConfig.public.siteUrl || "").trim();
  let preferredOrigin: string | null = null;

  if (configuredSiteUrl) {
    try {
      preferredOrigin = new URL(
        configuredSiteUrl.includes("://")
          ? configuredSiteUrl
          : `https://${configuredSiteUrl}`,
      ).origin;
    } catch {
      preferredOrigin = null;
    }
  }

  const forwardedProtocolHeader = getRequestHeader(event, "x-forwarded-proto");
  const forwardedProtocol = String(
    forwardedProtocolHeader || requestUrl.protocol.replace(":", ""),
  ).split(",")[0].trim();
  const currentOrigin = `${forwardedProtocol}://${forwardedHost}`;
  const normalizedPath = requestUrl.pathname === "/"
    ? "/"
    : requestUrl.pathname.replace(/\/+$/u, "");
  // TLS commonly terminates at nginx/CDN, so Nitro can see an internal HTTP
  // request even when the public request is already HTTPS. Comparing schemes
  // in that setup creates a redirect back to the exact same public URL.
  const preferredHost = preferredOrigin
    ? new URL(preferredOrigin).host.toLowerCase()
    : null;
  const preferredProtocol = preferredOrigin
    ? new URL(preferredOrigin).protocol.replace(":", "")
    : null;
  const protocolNeedsRedirect = Boolean(
    preferredProtocol &&
      forwardedProtocolHeader &&
      forwardedProtocol !== preferredProtocol,
  );
  const originNeedsRedirect = Boolean(
    (preferredHost && forwardedHost.toLowerCase() !== preferredHost) ||
      protocolNeedsRedirect,
  );
  const pathNeedsRedirect = normalizedPath !== requestUrl.pathname;

  if (!originNeedsRedirect && !pathNeedsRedirect) return;

  const target = new URL(
    `${normalizedPath}${requestUrl.search}`,
    preferredOrigin || currentOrigin,
  );
  return sendRedirect(event, target.toString(), 301);
});
