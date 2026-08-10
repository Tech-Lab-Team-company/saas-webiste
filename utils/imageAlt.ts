const GENERIC_IMAGE_ALT = /^(?:image|img|photo|picture|banner|slider|hero|logo|icon|app(?:lication)?[\s_-]*image|teacher[\s_-]*app[\s_-]*image|\u0635\u0648\u0631\u0629|\u0644\u0648\u062c\u0648|\u0634\u0639\u0627\u0631)$/iu;

const normalizeImageAlt = (value: string | null | undefined) =>
  String(value || "").replace(/[\s_-]+/gu, " ").trim();

export const getDescriptiveImageAlt = (
  value: string | null | undefined,
  fallback: string,
) => {
  const normalizedValue = normalizeImageAlt(value);

  return normalizedValue.length >= 3 && !GENERIC_IMAGE_ALT.test(normalizedValue)
    ? normalizedValue
    : normalizeImageAlt(fallback);
};
