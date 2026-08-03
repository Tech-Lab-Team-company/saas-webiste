import type { HomeSectionState } from '../types/homePage.types'

export interface HomeImageViewModel {
  src: string
  alt: string
}

export interface HomeHeroViewModel {
  title: string | null
  subtitle: string | null
  description: string | null
  link: string | null
  image: HomeImageViewModel | null
  mobileImage: HomeImageViewModel | null
}

export interface HomeCourseViewModel {
  id: number
  title: string
  description: string | null
  intro: string | null
  route: string
  image: HomeImageViewModel | null
  price: number | null
  currency: string | null
  isPaid: boolean | null
  isSubscribed: boolean | null
  teacher: {
    id: number | null
    name: string | null
    image: HomeImageViewModel | null
  } | null
  sourceSubject: {
    id: number | null
    title: string | null
  } | null
  videosCount: number | null
  documentsCount: number | null
  recordingsCount: number | null
}

export type HomeCourseTabKey = 'first-secondary' | 'second-secondary' | 'third-secondary'

export interface HomeCourseTabViewModel {
  key: HomeCourseTabKey
  label: string
  stageId: number
  yearId: number
  courses: HomeCourseViewModel[]
}

export interface HomeCoursesViewModel {
  tabs: HomeCourseTabViewModel[]
  unassignedCourses: HomeCourseViewModel[]
}

export interface HomeBlogViewModel {
  id: number
  title: string
  subtitle: string | null
  description: string | null
  date: string | null
  route: string
  image: HomeImageViewModel | null
}

export interface HomeBookViewModel {
  id: number
  bookId: number
  image: string | null
  numberOfPages: number | null
  title: string
  subtitle: string | null
  description: string | null
  isFree: boolean
  price: string
  currency: string
  bookType: number | null
  invoiceLink: string | null
}

export interface HomeBooksViewModel {
  items: HomeBookViewModel[]
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
}

export interface HomeBookDetailsViewModel extends HomeBookViewModel {
  images: string[]
  certificatesCount: number
  videoLinks: string[]
  externalVideoLinks: string[]
  ratesCount: number
  videoLinksCount: number
  offlineVideoLinksCount: number
  multimediaCount: number
  fees: number
  vat: number
  totalAfterDiscount: number
  isFavorite: boolean
  allowStatus: number
  orderStatus: number
  bookUrl: string | null
  isFlipbook: boolean
  hasFreePreview: boolean
  isFreeFlipbook: boolean
  freeBookUrl: string | null
}

export interface HomeLearningJourneyItemViewModel {
  id: number | string
  title: string
  description: string
}

export interface HomeLearningJourneyViewModel {
  eyebrow: string
  title: string
  description: string
  icon: HomeImageViewModel | null
  link: string
  linkLabel: string
  items: HomeLearningJourneyItemViewModel[]
}

export interface HomeAboutTeacherBenefitViewModel {
  id: number
  title: string
  description: string
}

export interface HomeAboutTeacherViewModel {
  id: number
  title: string
  subTitle: string
  description: string
  icon: HomeImageViewModel | null
  experience: {
    value: string
    prefix: string
  }
  benefits: HomeAboutTeacherBenefitViewModel[]
  link: string
  linkLabel: string
}

export interface HomeCtaViewModel {
  eyebrow: string
  title: string
  description: string
}

export interface HomeSiteViewModel {
  brandName: string | null
  description: string | null
  logo: HomeImageViewModel | null
  cover: HomeImageViewModel | null
  phone: string | null
  email: string | null
  address: string | null
  socials: {
    facebook: string | null
    instagram: string | null
    whatsapp: string | null
    youtube: string | null
  }
  app: {
    androidUrl: string | null
    iosUrl: string | null
  }
  colors: {
    primary: string | null
    secondary: string | null
  }
}

export interface HomePageViewModel {
  site: HomeSiteViewModel
  hero: HomeSectionState<HomeHeroViewModel | null>
  courses: HomeSectionState<HomeCoursesViewModel>
  blogs: HomeSectionState<HomeBlogViewModel[]>
  books: HomeSectionState<HomeBooksViewModel>
  learningJourney: HomeSectionState<HomeLearningJourneyViewModel>
  aboutTeacher: HomeSectionState<HomeAboutTeacherViewModel>
  cta: HomeSectionState<HomeCtaViewModel>
}
