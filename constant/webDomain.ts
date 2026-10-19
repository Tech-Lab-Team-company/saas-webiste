export function getWebDomain(): string {
  const configuredWebLink = String(
    useRuntimeConfig().public.webLink || "",
  ).trim();

  if (!configuredWebLink) return "";

  try {
    const url = configuredWebLink.includes("://")
      ? configuredWebLink
      : `https://${configuredWebLink}`;
    return new URL(url).hostname;
  } catch {
    return configuredWebLink
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      .trim();
  }
}
