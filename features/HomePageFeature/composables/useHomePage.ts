import { storeToRefs } from 'pinia'
import { getWebDomain } from '~/constant/webDomain'
import { HomePageApi, normalizeHomeDataError } from '../api/homePageApi'
import {
  createEmptyHomePageViewModel,
  mapHomeCoursePage,
  mapHomeCourseSubjectIds,
  mapHomeCourseStages,
  mapHomeCourseYears,
  mapHomePage,
  mapHomeSite,
} from '../mappers/homePageMapper'
import type {
  HomeCourseStageViewModel,
  HomeCoursePageViewModel,
  HomeCourseTabViewModel,
  HomePageViewModel,
} from '../models/HomePageViewModel'
import type { HomeDataError, HomeSectionState } from '../types/homePage.types'

export const useHomePage = async () => {
  const settingsStore = useSettingStore()
  const { setting } = storeToRefs(settingsStore)
  const webDomain = getWebDomain()
  const api = new HomePageApi(webDomain)

  const homeRequest = useAsyncData<HomePageViewModel>(
    `home-v2-data:dynamic-v4:${webDomain}`,
    async () => mapHomePage(await api.load(), setting.value),
    {
      default: createEmptyHomePageViewModel,
      dedupe: 'defer',
    },
  )

  const taxonomyRequest = useAsyncData<{
    stages: HomeCourseStageViewModel[]
    tabs: HomeCourseTabViewModel[]
  }>(
    `course-taxonomy:dynamic-v1:${webDomain}`,
    async () => {
      const stages = mapHomeCourseStages(await api.fetchStages())
      const yearResults = await Promise.allSettled(
        stages.map(async (stage) => ({
          stage,
          years: await api.fetchStageYears(stage.id),
        })),
      )
      const tabs = yearResults.flatMap((result) =>
        result.status === 'fulfilled'
          ? mapHomeCourseYears(result.value.stage, result.value.years)
          : [],
      )

      if (stages.length > 0 && tabs.length === 0) {
        const failedRequest = yearResults.find(
          (result): result is PromiseRejectedResult => result.status === 'rejected',
        )
        if (failedRequest) throw failedRequest.reason
      }

      return { stages, tabs }
    },
    {
      default: () => ({ stages: [], tabs: [] }),
      dedupe: 'defer',
    },
  )

  const [homeResult, taxonomyResult] = await Promise.all([
    homeRequest,
    taxonomyRequest,
  ])
  const {
    data,
    pending: homePending,
    error,
    refresh,
  } = homeResult
  const {
    data: courseTaxonomy,
    pending: courseTaxonomyPending,
    error: courseTaxonomyError,
  } = taxonomyResult

  const home = computed<HomePageViewModel>(() => {
    const currentHome = data.value ?? createEmptyHomePageViewModel()
    const site = mapHomeSite(setting.value)

    const taxonomy = courseTaxonomy.value ?? { stages: [], tabs: [] }
    const taxonomyStatus = courseTaxonomyPending.value
      ? 'loading'
      : courseTaxonomyError.value
        ? 'error'
        : taxonomy.stages.length > 0 && taxonomy.tabs.length > 0
          ? 'success'
          : 'empty'

    return {
      ...currentHome,
      site,
      courses: {
        ...currentHome.courses,
        data: {
          ...currentHome.courses.data,
          stages: taxonomy.stages,
          tabs: taxonomy.tabs,
          taxonomyStatus,
          taxonomyError: courseTaxonomyError.value
            ? normalizeHomeDataError(courseTaxonomyError.value).message
            : null,
        },
      },
    }
  })

  const normalizedError = computed<HomeDataError | null>(() =>
    error.value ? normalizeHomeDataError(error.value) : null,
  )

  const loadCoursesByYear = async (
    stageId: number,
    yearId: number,
    page = 1,
    perPage = 9,
  ): Promise<HomeSectionState<HomeCoursePageViewModel>> => {
    try {
      const [coursesResponse, subjectsResponse] = await Promise.all([
        api.fetchCoursesByYear(stageId, yearId, page, perPage),
        api.fetchSubjectsByYear(yearId),
      ])
      const allowedSubjectIds = mapHomeCourseSubjectIds(subjectsResponse)
      const coursePage = mapHomeCoursePage(
        coursesResponse,
        page,
        perPage,
        allowedSubjectIds,
      )

      return {
        data: coursePage,
        status: coursePage.courses.length > 0 ? 'success' : 'empty',
      }
    } catch (requestError) {
      return {
        data: {
          courses: [],
          pagination: {
            currentPage: page,
            lastPage: 1,
            perPage,
            total: 0,
            serverDriven: false,
          },
        },
        status: 'error',
        error: normalizeHomeDataError(requestError),
      }
    }
  }

  return {
    home,
    pending: computed(() => homePending.value || courseTaxonomyPending.value),
    error: normalizedError,
    refresh,
    loadCoursesByYear,
  }
}
