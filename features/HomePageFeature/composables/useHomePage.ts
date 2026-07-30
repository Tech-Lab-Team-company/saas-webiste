import { storeToRefs } from 'pinia'
import { HomePageApi, normalizeHomeDataError, resolveHomeWebDomain } from '../api/homePageApi'
import { createEmptyHomePageViewModel, mapHomeCourseList, mapHomePage, mapHomeSite } from '../mappers/homePageMapper'
import type { HomeCourseViewModel, HomePageViewModel } from '../models/HomePageViewModel'
import type { HomeDataError, HomeSectionState } from '../types/homePage.types'

export const useHomePage = () => {
  const settingsStore = useSettingStore()
  const { setting } = storeToRefs(settingsStore)
  const requestUrl = useRequestURL()
  const api = new HomePageApi(resolveHomeWebDomain(requestUrl.hostname))

  const { data, pending, error, refresh } = useAsyncData<HomePageViewModel>(
    'home-v2-data',
    async () => mapHomePage(await api.load(), setting.value),
    {
      default: createEmptyHomePageViewModel,
      dedupe: 'defer',
    },
  )

  const home = computed<HomePageViewModel>(() => {
    const currentHome = data.value ?? createEmptyHomePageViewModel()

    return {
      ...currentHome,
      site: mapHomeSite(setting.value),
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
    pending,
    error: normalizedError,
    refresh,
    loadCoursesByYear,
  }
}
