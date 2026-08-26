// Resolves the tenant purely from the URL that was actually opened, so one
// deployment serves every domain without a per-tenant .env value.
// `useRequestURL()` is Nuxt's SSR-safe equivalent of `window.location` here:
// it reads the incoming request's Host header during SSR and falls back to
// `window.location` once hydrated on the client.
export function getWebDomain(): string {
  if (import.meta.client) {
    return window.location.hostname;
  }

  try {
    return useRequestURL().hostname;
  } catch {
    return "";
  }
}