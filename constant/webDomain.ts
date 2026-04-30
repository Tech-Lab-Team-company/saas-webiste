export function getWebDomain(): string {
  const url = window.location.href;
  try {
    const hostname = new URL(url).hostname;
    if (hostname === "localhost" || hostname === "mr-eslamsalama.com")
      return "mr-eslamsalama.com";
    // const parts = hostname.split('.');
    // return parts.slice(-2).join('.');
    return hostname;
  } catch {
    return "mr-eslamsalama.com";
  }
}

// kodrat.success.sa
// hrarabians.org
// islam-salama.techlabeg.com
// almaherinenglish.com
// hadybazeed.com
// mrbackend.eduhubco.com
// https://mr-eslamsalama.com/
// garhy-academy.com
// mr-mohamedkarawya.com
// physics-beyts.azcourses.org
