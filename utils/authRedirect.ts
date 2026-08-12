const AUTH_REDIRECT_STORAGE_KEY = "auth:intended-route";

const getRedirectString = (value: unknown): string | null => {
  const candidate = Array.isArray(value) ? value[0] : value;

  return typeof candidate === "string" ? candidate : null;
};

export const sanitizeAuthRedirect = (value: unknown): string | null => {
  const candidate = getRedirectString(value)?.trim();

  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    /[\u0000-\u001f]/u.test(candidate)
  ) {
    return null;
  }

  const pathname = candidate.split(/[?#]/u)[0].toLowerCase();

  // Do not redirect back into authentication pages and create a loop.
  if (/^\/(?:login(?:home)?|auth)(?:\/|$)/u.test(pathname)) {
    return null;
  }

  return candidate;
};

export const rememberAuthRedirect = (value: unknown): string | null => {
  const redirect = sanitizeAuthRedirect(value);

  if (redirect && import.meta.client) {
    window.sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, redirect);
  }

  return redirect;
};

export const getAuthRedirect = (value?: unknown): string | null => {
  const queryRedirect = sanitizeAuthRedirect(value);

  if (queryRedirect) {
    return queryRedirect;
  }

  if (!import.meta.client) {
    return null;
  }

  return sanitizeAuthRedirect(
    window.sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY),
  );
};

export const consumeAuthRedirect = (value?: unknown): string | null => {
  const redirect = getAuthRedirect(value);

  if (import.meta.client) {
    window.sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
  }

  return redirect;
};
