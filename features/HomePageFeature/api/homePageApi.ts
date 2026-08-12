import { $fetch, FetchError } from "ofetch";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import { HeroSectionTypeEnum } from "../types/homePage.types";
import type {
  HomeApiSourceResult,
  HomeDataError,
  HomePageApiSources,
} from "../types/homePage.types";

const normalizeHomeDataError = (error: unknown): HomeDataError => {
  if (error instanceof FetchError) {
    const statusCode = error.response?.status;

    if (error.cause instanceof Error && error.cause.name === "AbortError") {
      return {
        type: "timeout",
        message: "تعذر تحميل هذا القسم في الوقت الحالي.",
      };
    }

    if (!error.response) {
      return {
        type: "network",
        message: "تعذر الاتصال بالخدمة في الوقت الحالي.",
      };
    }

    return {
      type: "server",
      message: "تعذر تحميل هذا القسم في الوقت الحالي.",
      ...(typeof statusCode === "number" ? { statusCode } : {}),
    };
  }

  if (error instanceof HomeApiResponseError) {
    return {
      type: "invalid-response",
      message: "تعذر تحميل هذا القسم في الوقت الحالي.",
    };
  }

  return { type: "unknown", message: "تعذر تحميل هذا القسم في الوقت الحالي." };
};

class HomeApiResponseError extends Error {
  constructor() {
    super("HOME_API_INVALID_RESPONSE");
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readEnvelopeData = (value: unknown): unknown => {
  if (!isRecord(value) || !("data" in value)) {
    throw new HomeApiResponseError();
  }

  return value.data;
};

const toSourceResult = (
  result: PromiseSettledResult<unknown>,
): HomeApiSourceResult<unknown> => {
  if (result.status === "fulfilled") {
    return { kind: "success", data: result.value };
  }

  return { kind: "error", error: normalizeHomeDataError(result.reason) };
};

export class HomePageApi {
  constructor(private readonly webDomain: string) {}

  async load(): Promise<HomePageApiSources> {
    const [
      heroSections,
      courseSections,
      blogs,
      books,
      learningJourney,
      aboutTeacher,
      readySection,
    ] = await Promise.allSettled([
      this.fetchHeroSections(HeroSectionTypeEnum.HOME_API_WEBSITE),
      this.fetchCourseSections(),
      this.fetchBlogs(),
      this.fetchHomeBookSection(),
      this.fetchLearningJourney(),
      this.fetchAboutTeacher(),
      this.fetchReadySection(),
    ]);

    return {
      heroSections: toSourceResult(heroSections),
      courseSections: toSourceResult(courseSections),
      blogs: toSourceResult(blogs),
      books: toSourceResult(books),
      learningJourney: toSourceResult(learningJourney),
      aboutTeacher: toSourceResult(aboutTeacher),
      readySection: toSourceResult(readySection),
    };
  }

  async fetchCoursesByYear(
    stageId: number,
    yearId: number,
    page = 1,
    perPage = 9,
  ): Promise<unknown> {
    return this.post(
      ApiNames.Instance.filter_courses,
      {
        category_id: 1,
        type: 1,
        education_type_id: null,
        stage_id: stageId,
        year_id: yearId,
        subject_id: null,
        university_id: null,
        college_id: null,
        department_id: null,
        division_id: null,
        university_subject_id: null,
        page,
        per_page: perPage,
      },
    );
  }

  async fetchPublicCourseCatalog(
    page = 1,
    perPage = 100,
  ): Promise<unknown> {
    // The anonymous filter endpoint is the source of truth for courses that
    // are publicly listable for this tenant. Keep tenant identity in headers;
    // pagination belongs to the API request, never to the public URL origin.
    return this.post(
      ApiNames.Instance.filter_courses,
      {
        category_id: null,
        type: null,
        education_type_id: null,
        stage_id: null,
        year_id: null,
        subject_id: null,
        university_id: null,
        college_id: null,
        department_id: null,
        division_id: null,
        university_subject_id: null,
        page,
        per_page: perPage,
      },
      { page, per_page: perPage },
    );
  }

  async fetchStages(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_stages, {});
  }

  async fetchStageYears(stageId: number): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_stage_years, {
      stage_id: stageId,
    });
  }

  async fetchSubjectsByYear(yearId: number): Promise<unknown> {
    return this.post(ApiNames.Instance.educationbasicsubjects, {
      category_id: 1,
      year_id: yearId,
    });
  }

  async fetchBooks(page = 1, subjectId: number | null = null): Promise<unknown> {
    return this.post(
      ApiNames.Instance.fetch_books,
      { subject_id: subjectId },
      { page },
    );
  }

  private async fetchHomeBookSection(): Promise<unknown> {
    const [sectionsResult, booksResult] = await Promise.allSettled([
      this.post(ApiNames.Instance.fetch_home_book_section, { for_home: 1 }),
      this.fetchBooks(),
    ]);

    if (sectionsResult.status === "rejected") {
      throw sectionsResult.reason;
    }

    if (booksResult.status === "rejected") {
      return sectionsResult.value;
    }

    const sections = Array.isArray(sectionsResult.value)
      ? sectionsResult.value
      : [];
    const booksRoot = isRecord(booksResult.value) ? booksResult.value : {};
    const books = Array.isArray(booksRoot.data)
      ? booksRoot.data
      : Array.isArray(booksResult.value)
        ? booksResult.value
        : [];
    const imageByBookId = new Map<number, string>();

    for (const item of books) {
      if (!isRecord(item)) continue;

      const id = Number(item.book_id ?? item.id);
      const image = typeof item.image === "string" ? item.image.trim() : "";
      if (Number.isFinite(id) && image) imageByBookId.set(id, image);
    }

    return sections.map((item) => {
      if (!isRecord(item)) return item;

      const nestedBook = isRecord(item.book) ? item.book : {};
      const bookId = Number(nestedBook.id ?? item.book_id);
      const bookImage = imageByBookId.get(bookId);
      if (!bookImage) return item;

      return {
        ...item,
        image: bookImage,
        book: {
          ...nestedBook,
          image: bookImage,
        },
      };
    });
  }

  async fetchBookDetails(bookId: number): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_home_websection_book_details, {
      book_id: bookId,
    });
  }

  async fetchHeroSections(type: HeroSectionTypeEnum): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_hero_sections, { type });
  }

  private async fetchCourseSections(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_home_website_section, { type: 1 });
  }

  async fetchBlogs(hashtagId?: number): Promise<unknown> {
    return this.post(
      ApiNames.Instance.fetch_blogs,
      hashtagId ? { hashtag_id: hashtagId } : {},
    );
  }

  async fetchBlog(slug: string): Promise<unknown> {
    return this.post(ApiNames.Instance.show_blog, { slug });
  }

  async fetchHashtags(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_hashtags, {});
  }

  private async fetchLearningJourney(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_home_learning_journey, {});
  }

  private async fetchAboutTeacher(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_about_teacher, {});
  }

  private async fetchReadySection(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_ready_section, {});
  }

  private async post(
    url: string,
    data: Record<string, number | string | null>,
    queryParams?: Record<string, number>,
  ): Promise<unknown> {
    const response = await $fetch<unknown>(url, {
      baseURL: ApiNames.Instance.baseUrl,
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        "Content-Type": "application/json",
        "web-domain": this.webDomain,
      },
      query: queryParams,
    });

    return readEnvelopeData(response);
  }
}

export { normalizeHomeDataError };
