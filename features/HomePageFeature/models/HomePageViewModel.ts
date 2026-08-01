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

export interface HomeLearningJourneyItemViewModel {
  id: number | string
  title: string
  description: string
}

export interface HomeLearningJourneyViewModel {
  eyebrow: string
  title: string
  description: string
  link: string
  linkLabel: string
  items: HomeLearningJourneyItemViewModel[]
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

export interface HomeNotesViewModel {
  status: 'unsupported'
  reason: string
}

export interface HomePageViewModel {
  site: HomeSiteViewModel
  hero: HomeSectionState<HomeHeroViewModel | null>
  courses: HomeSectionState<HomeCoursesViewModel>
  blogs: HomeSectionState<HomeBlogViewModel[]>
  learningJourney: HomeSectionState<HomeLearningJourneyViewModel>
  notes: HomeNotesViewModel
}
