import axios from "axios";
import { ApiNames } from "~/base/core/networkStructure/apiNames";
import NetworkService from "~/base/core/networkStructure/networking/network_service";
import { HeroSectionTypeEnum } from "../types/homePage.types";
import type {
  HomeApiSourceResult,
  HomeDataError,
  HomePageApiSources,
} from "../types/homePage.types";

const normalizeHomeDataError = (error: unknown): HomeDataError => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;

    if (error.code === "ECONNABORTED") {
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

  async fetchCoursesByYear(stageId: number, yearId: number): Promise<unknown> {
    return this.post(ApiNames.Instance.filter_courses, {
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
    });
  }

  async fetchBooks(page = 1): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_books, {}, { page });
  }

  private async fetchHomeBookSection(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_home_book_section, { for_home: 1 });
  }

  async fetchBookDetails(bookId: number): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_book_details, { book_id: bookId });
  }

  async fetchHeroSections(type: HeroSectionTypeEnum): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_hero_sections, { type });
  }

  private async fetchCourseSections(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_home_website_section, { type: 1 });
  }

  private async fetchBlogs(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_blogs, {});
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
    data: Record<string, number | null>,
    queryParams?: Record<string, number>,
  ): Promise<unknown> {
    const response = await NetworkService.instance.post({
      url,
      data,
      headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        "Content-Type": "application/json",
        "web-domain": this.webDomain,
      },
      queryParams,
      isAuth: false,
    });

    return readEnvelopeData(response.data);
  }
}

export { normalizeHomeDataError };
