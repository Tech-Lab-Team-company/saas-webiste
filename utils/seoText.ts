const normalizeSeoText = (value: string | null | undefined) =>
  String(value || "").replace(/\s+/gu, " ").trim();

const truncateAtWord = (value: string, limit: number) => {
  if (value.length <= limit) return value;

  const candidate = value.slice(0, Math.max(1, limit - 1));
  const lastSpace = candidate.lastIndexOf(" ");
  const cutAt = lastSpace >= Math.floor(limit * 0.65)
    ? lastSpace
    : candidate.length;

  return `${candidate.slice(0, cutAt).trimEnd()}…`;
};

export const buildSeoTitle = (
  primary: string | null | undefined,
  brand?: string | null,
  limit = 65,
) => {
  const normalizedPrimary = normalizeSeoText(primary) || "منصة تعليمية";
  const normalizedBrand = normalizeSeoText(brand);
  const suffix = normalizedBrand && normalizedPrimary !== normalizedBrand
    ? ` | ${normalizedBrand}`
    : "";

  if (`${normalizedPrimary}${suffix}`.length <= limit) {
    return `${normalizedPrimary}${suffix}`;
  }

  return `${truncateAtWord(
    normalizedPrimary,
    Math.max(20, limit - suffix.length),
  )}${suffix}`;
};
