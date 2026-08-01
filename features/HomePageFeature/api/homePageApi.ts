import axios from 'axios'
import { ApiNames } from '~/base/core/networkStructure/apiNames'
import NetworkService from '~/base/core/networkStructure/networking/network_service'
import type { HomeApiSourceResult, HomeDataError, HomePageApiSources } from '../types/homePage.types'

const DEFAULT_WEB_DOMAIN = 'mr-eslamsalama.com'

export const resolveHomeWebDomain = (hostname: string): string => {
  const normalizedHostname = hostname.trim().toLowerCase()

  if (!normalizedHostname || normalizedHostname === 'localhost' || normalizedHostname === DEFAULT_WEB_DOMAIN) {
    return DEFAULT_WEB_DOMAIN
  }

  return normalizedHostname
}

const normalizeHomeDataError = (error: unknown): HomeDataError => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status

    if (error.code === 'ECONNABORTED') {
      return { type: 'timeout', message: 'تعذر تحميل هذا القسم في الوقت الحالي.' }
    }

    if (!error.response) {
      return { type: 'network', message: 'تعذر الاتصال بالخدمة في الوقت الحالي.' }
    }

    return {
      type: 'server',
      message: 'تعذر تحميل هذا القسم في الوقت الحالي.',
      ...(typeof statusCode === 'number' ? { statusCode } : {}),
    }
  }

  if (error instanceof HomeApiResponseError) {
    return { type: 'invalid-response', message: 'تعذر تحميل هذا القسم في الوقت الحالي.' }
  }

  return { type: 'unknown', message: 'تعذر تحميل هذا القسم في الوقت الحالي.' }
}

class HomeApiResponseError extends Error {
  constructor() {
    super('HOME_API_INVALID_RESPONSE')
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const readEnvelopeData = (value: unknown): unknown => {
  if (!isRecord(value) || !('data' in value)) {
    throw new HomeApiResponseError()
  }

  return value.data
}

const toSourceResult = (result: PromiseSettledResult<unknown>): HomeApiSourceResult<unknown> => {
  if (result.status === 'fulfilled') {
    return { kind: 'success', data: result.value }
  }

  return { kind: 'error', error: normalizeHomeDataError(result.reason) }
}

export class HomePageApi {
  constructor(private readonly webDomain: string) {}

  async load(): Promise<HomePageApiSources> {
    const [heroSections, sliders, courseSections, blogs, learningJourney] = await Promise.allSettled([
      this.fetchHeroSections(),
      this.fetchSliders(),
      this.fetchCourseSections(),
      this.fetchBlogs(),
      this.fetchLearningJourney(),
    ])

    return {
      heroSections: toSourceResult(heroSections),
      sliders: toSourceResult(sliders),
      courseSections: toSourceResult(courseSections),
      blogs: toSourceResult(blogs),
      learningJourney: toSourceResult(learningJourney),
    }
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
    })
  }

  private async fetchHeroSections(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_hero_sections, {})
  }

  private async fetchSliders(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_home_sliders, { type: 3 })
  }

  private async fetchCourseSections(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_home_website_section, { type: 1 })
  }

  private async fetchBlogs(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_blogs, {})
  }

  private async fetchLearningJourney(): Promise<unknown> {
    return this.post(ApiNames.Instance.fetch_home_learning_journey, {})
  }

  private async post(url: string, data: Record<string, number | null>): Promise<unknown> {
    const response = await NetworkService.instance.post({
      url,
      data,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'ar',
        'Content-Type': 'application/json',
        'web-domain': this.webDomain,
      },
      isAuth: false,
    })

    return readEnvelopeData(response.data)
  }
}

export { normalizeHomeDataError }
