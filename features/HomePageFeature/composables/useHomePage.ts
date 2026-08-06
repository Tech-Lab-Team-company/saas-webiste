import { storeToRefs } from 'pinia'
import { getWebDomain } from '~/constant/webDomain'
import { HomePageApi, normalizeHomeDataError } from '../api/homePageApi'
import {
  createEmptyHomePageViewModel,
  mapHomeAboutTeacherMock,
  mapHomeCourseList,
  mapHomeCourseStages,
  mapHomeCourseYears,
  mapHomePage,
  mapHomeSite,
} from '../mappers/homePageMapper'
import type {
  HomeCourseStageViewModel,
  HomeCourseTabViewModel,
  HomeCourseViewModel,
  HomePageViewModel,
} from '../models/HomePageViewModel'
import type { HomeDataError, HomeSectionState } from '../types/homePage.types'

export const useHomePage = () => {
  const settingsStore = useSettingStore()
  const { setting } = storeToRefs(settingsStore)
  const webDomain = getWebDomain()
  const api = new HomePageApi(webDomain)

  const { data, pending: homePending, error, refresh } = useAsyncData<HomePageViewModel>(
    `home-v2-data:dynamic-v4:${webDomain}`,
    async () => mapHomePage(await api.load(), setting.value),
    {
      default: createEmptyHomePageViewModel,
      dedupe: 'defer',
    },
  )

  const {
    data: courseTaxonomy,
    pending: courseTaxonomyPending,
    error: courseTaxonomyError,
  } = useAsyncData<{
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
      aboutTeacher:
        currentHome.aboutTeacher.status === 'empty'
          ? {
              data: mapHomeAboutTeacherMock(site),
              status: 'empty',
            }
          : currentHome.aboutTeacher,
    }
  })

  const normalizedError = computed<HomeDataError | null>(() =>
    error.value ? normalizeHomeDataError(error.value) : null,
  )

  const loadCoursesByYear = async (
    stageId: number,
    yearId: number,
  ): Promise<HomeSectionState<HomeCourseViewModel[]>> => {
    try {
      const courses = mapHomeCourseList(await api.fetchCoursesByYear(stageId, yearId))

      return {
        data: courses,
        status: courses.length > 0 ? 'success' : 'empty',
      }
    } catch (requestError) {
      return {
        data: [],
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
