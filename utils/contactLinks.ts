const digitsOnly = (value: string | null | undefined): string =>
  String(value || "").replace(/\D/gu, "");

export const normalizeInternationalPhone = (
  value: string | null | undefined,
  countryCode: string | null | undefined = "+20",
): string | null => {
  const phoneDigits = digitsOnly(value);
  if (!phoneDigits) return null;

  const countryDigits = digitsOnly(countryCode) || "20";
  const internationalDigits = phoneDigits.startsWith(countryDigits)
    ? phoneDigits
    : phoneDigits.startsWith("0")
      ? `${countryDigits}${phoneDigits.slice(1)}`
      : `${countryDigits}${phoneDigits}`;

  return `+${internationalDigits}`;
};

export const createTelUrl = (
  value: string | null | undefined,
  countryCode?: string | null,
): string | null => {
  const phone = normalizeInternationalPhone(value, countryCode);
  return phone ? `tel:${phone}` : null;
};

export const createWhatsAppUrl = (
  value: string | null | undefined,
  countryCode?: string | null,
): string | null => {
  const phone = normalizeInternationalPhone(value, countryCode);
  return phone ? `https://wa.me/${phone.slice(1)}` : null;
};

export const createTelegramUrl = (
  value: string | null | undefined,
): string | null => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return null;

  const withoutProtocol = rawValue.replace(/^https?:\/\//iu, "");
  const telegramPathMatch = withoutProtocol.match(
    /^(?:www\.)?(?:t\.me|telegram\.me)\/(.+)$/iu,
  );

  if (telegramPathMatch) {
    const path = telegramPathMatch[1]?.replace(/^\/+|\/+$/gu, "");
    return path && !/\s/u.test(path) ? `https://t.me/${path}` : null;
  }

  const telegramDeepLinkMatch = rawValue.match(
    /^tg:\/\/resolve\?domain=([a-zA-Z0-9_]{5,})$/u,
  );
  if (telegramDeepLinkMatch?.[1]) {
    return `https://t.me/${telegramDeepLinkMatch[1]}`;
  }

  if (/^\+?[\d\s()-]{7,}$/u.test(rawValue)) {
    const phone = rawValue.replace(/\D/gu, "");
    return phone ? `https://t.me/+${phone}` : null;
  }

  const username = rawValue.replace(/^@/u, "").replace(/^\/+|\/+$/gu, "");
  return /^[a-zA-Z0-9_]{5,}$/u.test(username)
    ? `https://t.me/${username}`
    : null;
};
