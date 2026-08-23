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
import { supportsTeacherDirectory } from '../types/teacherType'
import { useTeacherDirectory } from './useTeacherDirectory'

interface UseHomePageOptions {
  initialTeacherId?: number | null
  initialWord?: string
}

const filterCoursePageByTeacher = (
  coursePage: HomeCoursePageViewModel,
  teacherId: number | null,
): HomeCoursePageViewModel => {
  if (teacherId === null) return coursePage

  const courses = coursePage.courses.filter(
    (course) => course.teacher?.id === teacherId,
  )
  const responseContainsOtherTeachers = coursePage.courses.some(
    (course) => course.teacher?.id !== teacherId,
  )

  if (!responseContainsOtherTeachers) {
    return { ...coursePage, courses }
  }

  return {
    courses,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: coursePage.pagination.perPage,
      total: courses.length,
      serverDriven: false,
    },
  }
}

export const useHomePage = async (options: UseHomePageOptions = {}) => {
  const settingsStore = useSettingStore()
  const { setting } = storeToRefs(settingsStore)
  const webDomain = getWebDomain()
  const api = new HomePageApi(webDomain)
  const initialTeacherId = options.initialTeacherId ?? null
  const initialWord = options.initialWord?.trim().slice(0, 100) ?? ''
  const tenantMode = supportsTeacherDirectory(setting.value?.type)
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
    `general-course-catalog:dynamic-v2:${webDomain}:${tenantMode}:teacher-${initialTeacherId ?? 'all'}:word-${encodeURIComponent(initialWord)}`,
    async () => tenantMode === 'general'
      ? filterCoursePageByTeacher(
          mapHomeCoursePage(
            await api.fetchPublicCourseCatalog(1, 9, initialTeacherId, initialWord),
            1,
            9,
          ),
          initialTeacherId,
        )
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
    const taxonomyStatus = courseTaxonomyPending.value
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
    teacherId: number | null = null,
    word = '',
  ): Promise<HomeSectionState<HomeCoursePageViewModel>> => {
    try {
      const [coursesResponse, subjectsResponse] = await Promise.all([
        api.fetchCoursesByYear(stageId, yearId, page, perPage, teacherId, word),
        api.fetchSubjectsByYear(yearId),
      ])
      const allowedSubjectIds = mapHomeCourseSubjectIds(subjectsResponse)
      const coursePage = filterCoursePageByTeacher(
        mapHomeCoursePage(
          coursesResponse,
          page,
          perPage,
          allowedSubjectIds,
        ),
        teacherId,
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
    teacherId: number | null = null,
    word = '',
  ): Promise<HomeSectionState<HomeCoursePageViewModel>> => {
    try {
      const coursePage = filterCoursePageByTeacher(
        mapHomeCoursePage(
          await api.fetchPublicCourseCatalog(page, perPage, teacherId, word),
          page,
          perPage,
        ),
        teacherId,
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
      courseTaxonomyPending.value ||
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
