export interface PublicCourseSitemapItem {
  id: number;
}

interface PublicCoursePage<T extends PublicCourseSitemapItem> {
  courses: T[];
  lastPage: number;
}

export const collectPublicCoursePages = async <
  T extends PublicCourseSitemapItem,
>(
  fetchPage: (page: number) => Promise<PublicCoursePage<T>>,
): Promise<T[]> => {
  const courses = new Map<number, T>();
  let page = 1;
  let lastPage = 1;

  do {
    const result = await fetchPage(page);

    for (const course of result.courses) {
      courses.set(course.id, course);
    }

    lastPage = Math.max(1, result.lastPage);
    page += 1;
  } while (page <= lastPage);

  return [...courses.values()];
};

export const findMissingCourseIds = (
  courses: PublicCourseSitemapItem[],
  sitemapPaths: string[],
) => {
  const sitemapCourseIds = new Set(
    sitemapPaths.flatMap((path) => {
      const match = path.match(/^\/course\/(\d+)\/?$/u);
      return match ? [Number(match[1])] : [];
    }),
  );

  return courses
    .map((course) => course.id)
    .filter((id) => !sitemapCourseIds.has(id));
};
