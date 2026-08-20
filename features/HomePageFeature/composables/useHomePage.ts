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
import { useTeacherDirectory } from './useTeacherDirectory'

export const useHomePage = async () => {
  const settingsStore = useSettingStore()
  const { setting } = storeToRefs(settingsStore)
  const webDomain = getWebDomain()
  const api = new HomePageApi(webDomain)
  const tenantMode = Number(setting.value?.has_general) === 1
    ? 'general'
    : 'education'
  const teacherDirectoryRequest = useTeacherDirectory()

  const homeRequest = useAsyncData<HomePageViewModel>(
    `home-v2-data:dynamic-v5:${webDomain}:${tenantMode}`,
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
    `course-taxonomy:dynamic-v2:${webDomain}:${tenantMode}`,
    async () => {
      if (tenantMode === 'general') return { stages: [], tabs: [] }

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

  const generalCatalogRequest = useAsyncData<HomeCoursePageViewModel>(
    `general-course-catalog:dynamic-v1:${webDomain}:${tenantMode}`,
    async () => tenantMode === 'general'
      ? mapHomeCoursePage(await api.fetchPublicCourseCatalog(1, 9), 1, 9)
      : mapHomeCoursePage(null),
    {
      default: () => mapHomeCoursePage(null),
      dedupe: 'defer',
    },
  )

  const [homeResult, taxonomyResult, generalCatalogResult, teacherDirectory] =
    await Promise.all([
      homeRequest,
      taxonomyRequest,
      generalCatalogRequest,
      teacherDirectoryRequest,
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
  const {
    data: generalCatalog,
    pending: generalCatalogPending,
    error: generalCatalogError,
  } = generalCatalogResult

  const home = computed<HomePageViewModel>(() => {
    const currentHome = data.value ?? createEmptyHomePageViewModel()
    const site = mapHomeSite(setting.value)

    const taxonomy = courseTaxonomy.value ?? { stages: [], tabs: [] }
    const taxonomyStatus = tenantMode === 'general'
      ? 'empty'
      : courseTaxonomyPending.value
      ? 'loading'
      : courseTaxonomyError.value
        ? 'error'
        : taxonomy.stages.length > 0 && taxonomy.tabs.length > 0
          ? 'success'
          : 'empty'

    const currentGeneralCatalog = generalCatalog.value ?? mapHomeCoursePage(null)
    const generalCatalogStatus = tenantMode !== 'general'
      ? 'empty'
      : generalCatalogPending.value
        ? 'loading'
        : generalCatalogError.value
          ? 'error'
          : currentGeneralCatalog.courses.length > 0
            ? 'success'
            : 'empty'

    return {
      ...currentHome,
      site,
      teachers: teacherDirectory.teachers.value,
      courses: {
        ...currentHome.courses,
        data: {
          ...currentHome.courses.data,
          mode: tenantMode,
          stages: taxonomy.stages,
          tabs: taxonomy.tabs,
          taxonomyStatus,
          taxonomyError: courseTaxonomyError.value
            ? normalizeHomeDataError(courseTaxonomyError.value).message
            : null,
          generalCatalog: currentGeneralCatalog,
          generalCatalogStatus,
          generalCatalogError: generalCatalogError.value
            ? normalizeHomeDataError(generalCatalogError.value).message
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

  const loadGeneralCourses = async (
    page = 1,
    perPage = 9,
  ): Promise<HomeSectionState<HomeCoursePageViewModel>> => {
    try {
      const coursePage = mapHomeCoursePage(
        await api.fetchPublicCourseCatalog(page, perPage),
        page,
        perPage,
      )

      return {
        data: coursePage,
        status: coursePage.courses.length > 0 ? 'success' : 'empty',
      }
    } catch (requestError) {
      return {
        data: mapHomeCoursePage(null, page, perPage),
        status: 'error',
        error: normalizeHomeDataError(requestError),
      }
    }
  }

  return {
    home,
    pending: computed(() =>
      homePending.value ||
      (tenantMode === 'education' && courseTaxonomyPending.value) ||
      (tenantMode === 'general' && (
        generalCatalogPending.value || teacherDirectory.pending.value
      )),
    ),
    error: normalizedError,
    refresh,
    loadCoursesByYear,
    loadGeneralCourses,
  }
}
