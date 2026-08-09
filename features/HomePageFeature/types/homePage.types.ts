export type HomeDataErrorType = 'network' | 'server' | 'timeout' | 'invalid-response' | 'unknown'

export interface HomeDataError {
  type: HomeDataErrorType
  message: string
  statusCode?: number
}

export type HomeSectionStatus = 'success' | 'empty' | 'error'

export enum HeroSectionTypeEnum {
  APP = 0,
  WEBSITE = 1,
  HOME_API_WEBSITE = 2,
  COURSES_API_APP = 3,
  ABOUT_API_WEBSITE = 4,
  BLOGS_API_WEBSITE = 6,
}

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

export interface HomeHeroSectionApiDto {
  id: number | null
  type: number | null
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
  text_background?: string | null
  type: number
  icon: string | null
  children: HomeSectionResourceChildApiDto[]
}

export interface HomeAboutTeacherExperienceApiDto {
  value: string
  prefix: string
}

export interface HomeAboutTeacherBenefitApiDto {
  id: number
  title: string
  description: string
}

export interface HomeAboutTeacherApiDto {
  id: number
  title: string
  sub_title: string
  description: string
  icon: string | null
  experience: HomeAboutTeacherExperienceApiDto
  benefits: HomeAboutTeacherBenefitApiDto[]
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

export interface HomeBookApiDto {
  id: number
  book_id: number
  image: string
  number_of_pages: number
  title: string
  subtitle: string
  attachments: unknown[]
  description: string
  isFree: boolean
  start_date: string
  end_date: string
  price: string
  currency: string
  book_types: Array<{
    id: number
    label: string
    price: number
  }>
  book_type: number
  invoice_link: string
}

export interface HomeBookDetailsApiDto extends HomeBookApiDto {
  images: string[]
  certificates: unknown[]
  video_link: string[]
  video_external_link: string[]
  rates: unknown[]
  number_of_video_link: number
  number_of_offline_video_link: number
  multiMedia: number
  fees: number
  vat: number
  total_after_discount: number
  bookStatus: unknown | null
  is_favorite: boolean
  allow_status: number
  order_status: number
  book_url: string
  is_flipbook: number
  has_free: number
  is_free_flipbook: number
  free_book_url: string
}

export interface HomeBooksApiDto {
  data: HomeBookApiDto[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
  }
}

export interface HomePageApiSources {
  heroSections: HomeApiSourceResult<unknown>
  courseSections: HomeApiSourceResult<unknown>
  blogs: HomeApiSourceResult<unknown>
  books: HomeApiSourceResult<unknown>
  learningJourney: HomeApiSourceResult<unknown>
  aboutTeacher: HomeApiSourceResult<unknown>
  readySection: HomeApiSourceResult<unknown>
}
