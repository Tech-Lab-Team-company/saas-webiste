import { storeToRefs } from 'pinia'
import { getWebDomain } from '~/constant/webDomain'
import { HomePageApi, normalizeHomeDataError } from '../api/homePageApi'
import {
  createEmptyHomePageViewModel,
  mapHomeAboutTeacherMock,
  mapHomeCourseList,
  mapHomePage,
  mapHomeSite,
} from '../mappers/homePageMapper'
import type { HomeCourseViewModel, HomePageViewModel } from '../models/HomePageViewModel'
import type { HomeDataError, HomeSectionState } from '../types/homePage.types'

export const useHomePage = () => {
  const settingsStore = useSettingStore()
  const { setting } = storeToRefs(settingsStore)
  const webDomain = getWebDomain()
  const api = new HomePageApi(webDomain)

  const { data, pending, error, refresh } = useAsyncData<HomePageViewModel>(
    `home-v2-data:dynamic-v2:${webDomain}`,
    async () => mapHomePage(await api.load(), setting.value),
    {
      default: createEmptyHomePageViewModel,
      dedupe: 'defer',
    },
  )

  const home = computed<HomePageViewModel>(() => {
    const currentHome = data.value ?? createEmptyHomePageViewModel()
    const site = mapHomeSite(setting.value)

    return {
      ...currentHome,
      site,
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
    pending,
    error: normalizedError,
    refresh,
    loadCoursesByYear,
  }
}
