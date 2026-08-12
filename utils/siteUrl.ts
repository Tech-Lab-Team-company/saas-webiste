const ensureAbsoluteOrigin = (
  configuredSiteUrl: string | null | undefined,
  fallbackOrigin: string,
) => {
  const configured = String(configuredSiteUrl || "").trim();

  if (configured) {
    try {
      return new URL(
        configured.includes("://") ? configured : `https://${configured}`,
      ).origin;
    } catch {
      // Invalid deployment configuration falls back to the active request.
    }
  }

  return new URL(fallbackOrigin).origin;
};

export const resolveSiteOrigin = (
  configuredSiteUrl: string | null | undefined,
  fallbackOrigin: string,
) => ensureAbsoluteOrigin(configuredSiteUrl, fallbackOrigin);

export const buildAbsoluteSiteUrl = (siteOrigin: string, path = "/") => {
  const normalizedPath = String(path || "/").trim() || "/";
  const suffixIndex = normalizedPath.search(/[?#]/u);
  const pathname = suffixIndex >= 0
    ? normalizedPath.slice(0, suffixIndex)
    : normalizedPath;
  const suffix = suffixIndex >= 0 ? normalizedPath.slice(suffixIndex) : "";
  const absolutePath = `/${pathname}`.replace(/\/{2,}/gu, "/") + suffix;

  return new URL(absolutePath, `${siteOrigin.replace(/\/+$/u, "")}/`).toString();
};

export const useSiteUrl = () => {
  const runtimeConfig = useRuntimeConfig();
  const requestUrl = useRequestURL();
  const siteOrigin = resolveSiteOrigin(
    String(runtimeConfig.public.siteUrl || ""),
    requestUrl.origin,
  );

  return {
    siteOrigin,
    buildSiteUrl: (path = "/") => buildAbsoluteSiteUrl(siteOrigin, path),
  };
};
