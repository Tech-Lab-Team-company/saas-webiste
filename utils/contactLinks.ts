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
