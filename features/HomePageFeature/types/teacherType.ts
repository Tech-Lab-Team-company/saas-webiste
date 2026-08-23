export const TeacherTypeEnum = {
  CENTER: 1,
  TEACHER: 2,
  CENTER_TEACHER: 3,
} as const;

export type TeacherTypeEnum =
  (typeof TeacherTypeEnum)[keyof typeof TeacherTypeEnum];

export const resolveTeacherType = (value: unknown): TeacherTypeEnum | null => {
  const type = Number(value);

  return type === TeacherTypeEnum.CENTER ||
    type === TeacherTypeEnum.TEACHER ||
    type === TeacherTypeEnum.CENTER_TEACHER
    ? type
    : null;
};

export const supportsTeacherDirectory = (value: unknown): boolean => {
  const type = resolveTeacherType(value);
  return type === TeacherTypeEnum.CENTER || type === TeacherTypeEnum.CENTER_TEACHER;
};

export const usesGeneralCourseCatalog = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false;

  const categoryIds = value
    .map(Number)
    .filter((categoryId) => Number.isInteger(categoryId) && categoryId > 0);

  return categoryIds.length === 1 && categoryIds[0] === 3;
};
