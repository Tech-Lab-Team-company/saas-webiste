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

// kodrat.success.sa
// hrarabians.org
// islam-salama.techlabeg.com
// almaherinenglish.com
// hadybazeed.com
// mrbackend.eduhubco.com
// https://mr-eslamsalama.com
// garhy-academy.com
// mr-mohamedkarawya.com
// physics-beyts.azcourses.org
