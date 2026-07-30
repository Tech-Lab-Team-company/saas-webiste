import type {
  HomeBlogApiDto,
  HomeCourseApiDto,
  HomeImageApiDto,
  HomePageApiSources,
  HomeSliderApiDto,
  HomeWebsiteSectionApiDto,
  HomeSectionState,
} from '../types/homePage.types'
import type {
  HomeBlogViewModel,
  HomeCourseTabViewModel,
  HomeCourseViewModel,
  HomeCoursesViewModel,
  HomeHeroViewModel,
  HomeImageViewModel,
  HomePageViewModel,
  HomeSiteViewModel,
} from '../models/HomePageViewModel'

const DEFAULT_HOME_ERROR_MESSAGE = 'تعذر تحميل هذا القسم في الوقت الحالي.'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toNullableString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const normalizedValue = value.trim()
  return normalizedValue.length > 0 ? normalizedValue : null
}

const toNullableNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const toNullableBoolean = (value: unknown): boolean | null =>
  typeof value === 'boolean' ? value : null

const toArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

const mapImageApiDto = (value: unknown): HomeImageApiDto | null => {
  if (!isRecord(value)) {
    return null
  }

  return {
    img: toNullableString(value.img),
    alt: toNullableString(value.alt),
  }
}

const mapImage = (image: HomeImageApiDto | null): HomeImageViewModel | null => {
  if (!image?.img) {
    return null
  }

  return {
    src: image.img,
    alt: image.alt ?? '',
  }
}

const mapSliderApiDto = (value: unknown): HomeSliderApiDto | null => {
  if (!isRecord(value)) {
    return null
  }

  const media = isRecord(value.media) ? value.media : null

  return {
    id: toNullableNumber(value.id),
    title: toNullableString(value.title),
    subtitle: toNullableString(value.subtitle),
    text: toNullableString(value.text),
    link: toNullableString(value.link),
    type: toNullableNumber(value.type),
    style: toNullableNumber(value.style),
    media: {
      image: media
        ? mapImageApiDto({ img: media.img, alt: media.alt })
        : null,
      mobileImage: media
        ? mapImageApiDto({ img: media.mobile_img, alt: media.mobile_alt })
        : null,
    },
  }
}

const mapCourseApiDto = (value: unknown): HomeCourseApiDto | null => {
  if (!isRecord(value)) {
    return null
  }

  const subject = isRecord(value.subject) ? value.subject : null
  const teacher = isRecord(value.teacher) ? value.teacher : null

  return {
    id: toNullableNumber(value.id),
    title: toNullableString(value.title),
    description: toNullableString(value.description),
    intro: toNullableString(value.intro),
    image: mapImageApiDto(value.image),
    price: toNullableNumber(value.course_price),
    currency: toNullableString(value.currency),
    isPaid: toNullableBoolean(value.is_paid),
    isSubscribed: toNullableBoolean(value.is_subscribed),
    subject: subject
      ? {
          id: toNullableNumber(subject.id),
          title: toNullableString(subject.title),
        }
      : null,
    teacher: teacher
      ? {
          id: toNullableNumber(teacher.id),
          name: toNullableString(teacher.name),
          image: mapImageApiDto(teacher.image),
        }
      : null,
    videosCount: toNullableNumber(value.course_videos),
    documentsCount: toNullableNumber(value.course_docs),
    recordingsCount: toNullableNumber(value.course_records),
  }
}

const mapWebsiteSectionApiDto = (value: unknown): HomeWebsiteSectionApiDto | null => {
  if (!isRecord(value)) {
    return null
  }

  return {
    id: toNullableNumber(value.id),
    title: toNullableString(value.title),
    subtitle: toNullableString(value.subtitle),
    description: toNullableString(value.description),
    order: toNullableNumber(value.order),
    style: toNullableNumber(value.style),
    type: toNullableNumber(value.type),
    courses: toArray(value.courses)
      .map(mapCourseApiDto)
      .filter((course): course is HomeCourseApiDto => course !== null),
  }
}

const mapBlogApiDto = (value: unknown): HomeBlogApiDto | null => {
  if (!isRecord(value)) {
    return null
  }

  return {
    id: toNullableNumber(value.id),
    slug: toNullableString(value.slug),
    title: toNullableString(value.title),
    subtitle: toNullableString(value.subtitle),
    description: toNullableString(value.description),
    date: toNullableString(value.date),
    attachments: toArray(value.attachments)
      .map(mapImageApiDto)
      .filter((attachment): attachment is HomeImageApiDto => attachment !== null),
  }
}

const mapHero = (slider: HomeSliderApiDto): HomeHeroViewModel => ({
  title: slider.title,
  subtitle: slider.subtitle,
  description: slider.text,
  link: slider.link,
  image: mapImage(slider.media.image),
  mobileImage: mapImage(slider.media.mobileImage),
})

const mapCourse = (course: HomeCourseApiDto): HomeCourseViewModel | null => {
  if (course.id === null || !course.title) {
    return null
  }

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    intro: course.intro,
    route: `/course/${course.id}`,
    image: mapImage(course.image),
    price: course.price,
    currency: course.currency,
    isPaid: course.isPaid,
    isSubscribed: course.isSubscribed,
    teacher: course.teacher
      ? {
          id: course.teacher.id,
          name: course.teacher.name,
          image: mapImage(course.teacher.image),
        }
      : null,
    sourceSubject: course.subject
      ? {
          id: course.subject.id,
          title: course.subject.title,
        }
      : null,
    videosCount: course.videosCount,
    documentsCount: course.documentsCount,
    recordingsCount: course.recordingsCount,
  }
}

export const mapHomeCourseList = (value: unknown): HomeCourseViewModel[] => {
  const courses = new Map<number, HomeCourseViewModel>()

  toArray(value).forEach((item) => {
    const courseApiDto = mapCourseApiDto(item)
    const course = courseApiDto ? mapCourse(courseApiDto) : null

    if (course && !courses.has(course.id)) {
      courses.set(course.id, course)
    }
  })

  return [...courses.values()]
}

const createFixedCourseTabs = (): HomeCourseTabViewModel[] => [
  {
    key: 'first-secondary',
    label: 'الصف الأول الثانوي',
    stageId: 4,
    yearId: 9,
    courses: [],
  },
  {
    key: 'second-secondary',
    label: 'الصف الثاني الثانوي',
    stageId: 4,
    yearId: 10,
    courses: [],
  },
  {
    key: 'third-secondary',
    label: 'الصف الثالث الثانوي',
    stageId: 4,
    yearId: 11,
    courses: [],
  },
]

const createEmptyCourses = (): HomeCoursesViewModel => ({
  tabs: createFixedCourseTabs(),
  unassignedCourses: [],
})

const mapCourses = (sections: HomeWebsiteSectionApiDto[]): HomeCoursesViewModel => {
  const uniqueCourses = new Map<number, HomeCourseViewModel>()

  sections
    .slice()
    .sort((first, second) => (first.order ?? Number.MAX_SAFE_INTEGER) - (second.order ?? Number.MAX_SAFE_INTEGER))
    .forEach((section) => {
      section.courses.forEach((course) => {
        const mappedCourse = mapCourse(course)

        if (mappedCourse && !uniqueCourses.has(mappedCourse.id)) {
          uniqueCourses.set(mappedCourse.id, mappedCourse)
        }
      })
    })

  return {
    tabs: createFixedCourseTabs(),
    unassignedCourses: [...uniqueCourses.values()],
  }
}

const mapBlog = (blog: HomeBlogApiDto): HomeBlogViewModel | null => {
  if (blog.id === null || !blog.title) {
    return null
  }

  return {
    id: blog.id,
    title: blog.title,
    subtitle: blog.subtitle,
    description: blog.description,
    date: blog.date,
    route: blog.slug ? `/blogs/${encodeURIComponent(blog.slug)}` : '/blogs',
    image: mapImage(blog.attachments[0] ?? null),
  }
}

const mapSectionError = <T>(data: T, error: HomeSectionState<T>['error']): HomeSectionState<T> => ({
  data,
  status: 'error',
  error: error ?? { type: 'unknown', message: DEFAULT_HOME_ERROR_MESSAGE },
})

const createEmptySite = (): HomeSiteViewModel => ({
  brandName: null,
  description: null,
  logo: null,
  cover: null,
  phone: null,
  email: null,
  address: null,
  socials: {
    facebook: null,
    instagram: null,
    whatsapp: null,
    youtube: null,
  },
  app: {
    androidUrl: null,
    iosUrl: null,
  },
  colors: {
    primary: null,
    secondary: null,
  },
})

export const mapHomeSite = (settings: unknown): HomeSiteViewModel => {
  if (!isRecord(settings)) {
    return createEmptySite()
  }

  return {
    brandName: toNullableString(settings.name),
    description: toNullableString(settings.description),
    logo: mapImage(mapImageApiDto(settings.image) ?? mapImageApiDto(settings.img)),
    cover: mapImage(mapImageApiDto(settings.cover)),
    phone: toNullableString(settings.phone),
    email: toNullableString(settings.email),
    address: toNullableString(settings.address),
    socials: {
      facebook: toNullableString(settings.facebook),
      instagram: toNullableString(settings.instagram),
      whatsapp: toNullableString(settings.whatsapp),
      youtube: toNullableString(settings.youtube),
    },
    app: {
      androidUrl: toNullableString(settings.play_store),
      iosUrl: toNullableString(settings.app_store),
    },
    colors: {
      primary: toNullableString(settings.primary_color),
      secondary: toNullableString(settings.secondary_color),
    },
  }
}

export const createEmptyHomePageViewModel = (): HomePageViewModel => ({
  site: createEmptySite(),
  hero: {
    data: null,
    status: 'empty',
  },
  courses: {
    data: createEmptyCourses(),
    status: 'empty',
  },
  blogs: {
    data: [],
    status: 'empty',
  },
  notes: {
    status: 'unsupported',
    reason: 'لا توجد واجهة بيانات أو مسار معتمد للمذكرات حاليًا.',
  },
})

export const mapHomePage = (sources: HomePageApiSources, settings: unknown): HomePageViewModel => {
  const hero = (() => {
    if (sources.sliders.kind === 'error') {
      return mapSectionError<HomeHeroViewModel | null>(null, sources.sliders.error)
    }

    const slider = toArray(sources.sliders.data)
      .map(mapSliderApiDto)
      .find((item): item is HomeSliderApiDto => item !== null)

    return slider
      ? { data: mapHero(slider), status: 'success' as const }
      : { data: null, status: 'empty' as const }
  })()

  const courses = (() => {
    if (sources.courseSections.kind === 'error') {
      return mapSectionError<HomeCoursesViewModel>(createEmptyCourses(), sources.courseSections.error)
    }

    const sections = toArray(sources.courseSections.data)
      .map(mapWebsiteSectionApiDto)
      .filter((section): section is HomeWebsiteSectionApiDto => section !== null)
    const mappedCourses = mapCourses(sections)

    return {
      data: mappedCourses,
      status: mappedCourses.unassignedCourses.length > 0 ? ('success' as const) : ('empty' as const),
    }
  })()

  const blogs = (() => {
    if (sources.blogs.kind === 'error') {
      return mapSectionError<HomeBlogViewModel[]>([], sources.blogs.error)
    }

    const mappedBlogs = toArray(sources.blogs.data)
      .map(mapBlogApiDto)
      .filter((blog): blog is HomeBlogViewModel => blog !== null)

    return {
      data: mappedBlogs,
      status: mappedBlogs.length > 0 ? ('success' as const) : ('empty' as const),
    }
  })()

  return {
    site: mapHomeSite(settings),
    hero,
    courses,
    blogs,
    notes: {
      status: 'unsupported',
      reason: 'لا توجد واجهة بيانات أو مسار معتمد للمذكرات حاليًا.',
    },
  }
}
