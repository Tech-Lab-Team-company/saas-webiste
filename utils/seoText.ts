export const normalizeSeoText = (value: string | null | undefined) =>
  String(value || "").replace(/\s+/gu, " ").trim();

export const htmlToSeoText = (value: string | null | undefined) =>
  normalizeSeoText(
    String(value || "")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ")
      .replace(/<[^>]+>/gu, " ")
      .replace(/&nbsp;|&#160;/giu, " ")
      .replace(/&amp;/giu, "&")
      .replace(/&quot;|&#34;/giu, '"')
      .replace(/&#39;|&apos;/giu, "'")
      .replace(/&lt;/giu, "<")
      .replace(/&gt;/giu, ">"),
  );

export const resolveHomepageSeo = ({
  metaTitle,
  metaDescription,
  heroTitle,
  heroSubtitle,
  heroDescription,
  brandName,
  siteDescription,
}: {
  metaTitle?: string | null;
  metaDescription?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  brandName?: string | null;
  siteDescription?: string | null;
}) => {
  const heroHeading = [heroTitle, heroSubtitle]
    .map(normalizeSeoText)
    .filter(Boolean)
    .join(" ");
  const title = normalizeSeoText(metaTitle)
    || [heroHeading, normalizeSeoText(brandName)].filter(Boolean).join(" | ")
    || "منصة تعليمية للكورسات والكتب";
  const description = normalizeSeoText(metaDescription)
    || htmlToSeoText(heroDescription)
    || normalizeSeoText(siteDescription)
    || "اكتشف الكورسات والكتب والمحتوى التعليمي المناسب لمسارك الدراسي.";

  return { title, description };
};

export const resolveCourseSeo = ({
  title,
  description,
  fallbackTitle,
  fallbackDescription,
}: {
  title?: string | null;
  description?: string | null;
  fallbackTitle?: string | null;
  fallbackDescription?: string | null;
}) => ({
  title: normalizeSeoText(title)
    || normalizeSeoText(fallbackTitle)
    || "تفاصيل الكورس",
  description: htmlToSeoText(description)
    || normalizeSeoText(fallbackDescription)
    || "تفاصيل الكورس ومحتواه التعليمي.",
});

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
