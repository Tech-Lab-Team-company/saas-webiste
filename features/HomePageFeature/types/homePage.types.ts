export type HomeDataErrorType = 'network' | 'server' | 'timeout' | 'invalid-response' | 'unknown'

export interface HomeDataError {
  type: HomeDataErrorType
  message: string
  statusCode?: number
}

export type HomeSectionStatus = 'success' | 'empty' | 'error'

export interface HomeSectionState<T> {
  data: T
  status: HomeSectionStatus
  error?: HomeDataError
}

export type HomeApiSourceResult<T> =
  | { kind: 'success'; data: T }
  | { kind: 'error'; error: HomeDataError }

export interface HomeImageApiDto {
  img: string | null
  alt: string | null
}

export interface HomeSliderApiDto {
  id: number | null
  title: string | null
  subtitle: string | null
  text: string | null
  link: string | null
  type: number | null
  style: number | null
  media: {
    image: HomeImageApiDto | null
    mobileImage: HomeImageApiDto | null
  }
}

export interface HomeHeroSectionApiDto {
  id: number | null
  title: string | null
  subtitle: string | null
  description: string | null
  link: string | null
  image: HomeImageApiDto | null
  mobileImage: HomeImageApiDto | null
}

export interface HomeSectionResourceChildApiDto {
  id: number
  title: string
  description: string
  type: number
  parent_id: number
}

export interface HomeSectionResourceApiDto {
  id: number
  title: string
  subtitle: string
  description: string
  type: number
  icon: string | null
  children: HomeSectionResourceChildApiDto[]
}

export interface HomeCourseApiDto {
  id: number | null
  title: string | null
  description: string | null
  intro: string | null
  image: HomeImageApiDto | null
  price: number | null
  currency: string | null
  isPaid: boolean | null
  isSubscribed: boolean | null
  subject: {
    id: number | null
    title: string | null
  } | null
  teacher: {
    id: number | null
    name: string | null
    image: HomeImageApiDto | null
  } | null
  videosCount: number | null
  documentsCount: number | null
  recordingsCount: number | null
}

export interface HomeWebsiteSectionApiDto {
  id: number | null
  title: string | null
  subtitle: string | null
  description: string | null
  order: number | null
  style: number | null
  type: number | null
  courses: HomeCourseApiDto[]
}

export interface HomeBlogApiDto {
  id: number | null
  slug: string | null
  title: string | null
  subtitle: string | null
  description: string | null
  date: string | null
  attachments: HomeImageApiDto[]
}

export interface HomePageApiSources {
  heroSections: HomeApiSourceResult<unknown>
  sliders: HomeApiSourceResult<unknown>
  courseSections: HomeApiSourceResult<unknown>
  blogs: HomeApiSourceResult<unknown>
  learningJourney: HomeApiSourceResult<unknown>
  aboutTeacher: HomeApiSourceResult<unknown>
}
