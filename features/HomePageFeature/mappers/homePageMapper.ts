import type {
  HomeBlogApiDto,
  HomeCourseApiDto,
  HomeImageApiDto,
  HomeHeroSectionApiDto,
  HomePageApiSources,
  HomeWebsiteSectionApiDto,
  HomeSectionState,
} from '../types/homePage.types'
import { HeroSectionTypeEnum } from '../types/homePage.types'
import type {
  HomeBlogViewModel,
  HomeBookDetailsResourceViewModel,
  HomeBookDetailsViewModel,
  HomeBookStepViewModel,
  HomeBookViewModel,
  HomeBooksViewModel,
  HomeAboutTeacherViewModel,
  HomeCtaViewModel,
  HomeCourseTabViewModel,
  HomeCourseViewModel,
  HomeCoursesViewModel,
  HomeHeroViewModel,
  HomeImageViewModel,
  HomeLearningJourneyItemViewModel,
  HomeLearningJourneyViewModel,
  HomePageViewModel,
  HomeSiteViewModel,
  HomeWebsiteSectionBookViewModel,
} from '../models/HomePageViewModel'
import { BookPriceTypeEnum, BookTypeEnum } from '../models/HomePageViewModel'
import { homeBlogsMock } from '../mocks/homeBlogs.mock'
import { createHomeLearningJourneyMock } from '../mocks/homeLearningJourney.mock'
import { createHomeAboutTeacherMock } from '../mocks/homeAboutTeacher.mock'
import { createHomeHeroSectionMock } from '../mocks/homeHeroSection.mock'

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

const toSafeUrl = (value: unknown): string | null => {
  const url = toNullableString(value)
  return url && /^(https?:\/\/|\/)/i.test(url) ? url : null
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

const mapFlexibleImageApiDto = (value: unknown, fallbackAlt: unknown = null): HomeImageApiDto | null => {
  if (typeof value === 'string') {
    return {
      img: toNullableString(value),
      alt: toNullableString(fallbackAlt),
    }
  }

  return mapImageApiDto(value)
}

const mapHeroSectionApiDto = (value: unknown): HomeHeroSectionApiDto | null => {
  if (!isRecord(value)) {
    return null
  }

  const media = isRecord(value.media) ? value.media : null

  const hero: HomeHeroSectionApiDto = {
    id: toNullableNumber(value.id),
    type: toNullableNumber(value.type),
    title: toNullableString(value.title),
    subtitle: toNullableString(value.subtitle ?? value.sub_title),
    description: toNullableString(value.description ?? value.text),
    link: toNullableString(value.link ?? value.button_link ?? value.action_url),
    image: mapFlexibleImageApiDto(
      value.image ?? value.img ?? value.icon ?? media?.image ?? media?.img,
      value.image_alt ?? value.alt,
    ),
    mobileImage: mapFlexibleImageApiDto(
      value.mobile_image ?? value.mobile_img ?? media?.mobileImage ?? media?.mobile_img,
      value.mobile_image_alt ?? value.mobile_alt,
    ),
  }

  return hero.title || hero.subtitle || hero.description || hero.image || hero.mobileImage
    ? hero
    : null
}

const readHeroSections = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value
  }

  if (!isRecord(value)) {
    return []
  }

  const nestedSections = value.hero_sections ?? value.heroes ?? value.items
  return Array.isArray(nestedSections) ? nestedSections : [value]
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

const mapCustomHero = (hero: HomeHeroSectionApiDto): HomeHeroViewModel => ({
  title: hero.title,
  subtitle: hero.subtitle,
  description: hero.description,
  link: hero.link,
  image: mapImage(hero.image),
  mobileImage: mapImage(hero.mobileImage),
})

export const mapHeroSection = (
  value: unknown,
  expectedType?: HeroSectionTypeEnum,
): HomeHeroViewModel | null => {
  const heroes = readHeroSections(value)
    .map(mapHeroSectionApiDto)
    .filter((item): item is HomeHeroSectionApiDto =>
      item !== null && (expectedType === undefined || item.type === expectedType),
    )
  const hero = heroes[heroes.length - 1]

  return hero ? mapCustomHero(hero) : null
}

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

const createEmptyBooksPagination = (): HomeBooksViewModel['pagination'] => ({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
  hasPreviousPage: false,
  hasNextPage: false,
})

export const createEmptyBooks = (): HomeBooksViewModel => ({
  items: [],
  pagination: createEmptyBooksPagination(),
})

const mapBook = (value: unknown): HomeBookViewModel | null => {
  if (!isRecord(value)) {
    return null
  }

  const nestedBook = isRecord(value.book) ? value.book : null
  const id = toNullableNumber(value.id)
  const nestedBookId = nestedBook ? toNullableNumber(nestedBook.id) : null
  const title = toNullableString(value.title) ?? (nestedBook ? toNullableString(nestedBook.title) : null)

  if (id === null || !title) {
    return null
  }

  const bookTypes = toArray(value.book_types)
    .map((bookType) => {
      if (!isRecord(bookType)) return null

      const typeId = toNullableNumber(bookType.id)
      const label = toNullableString(bookType.label)
      const price = toNullableNumber(bookType.price)
      if (typeId === null || !label || price === null) return null

      return { id: typeId, label, price }
    })
    .filter((bookType): bookType is { id: number; label: string; price: number } => bookType !== null)

  if (nestedBook && bookTypes.length === 0) {
    const nestedPrices = [
      { id: 1, label: 'كتاب إلكتروني', price: toNullableNumber(nestedBook.ebook_price) },
      { id: 2, label: 'نسخة مطبوعة', price: toNullableNumber(nestedBook.paper_price) },
      { id: 3, label: 'إلكتروني ومطبوع', price: toNullableNumber(nestedBook.both_price) },
    ]

    bookTypes.push(...nestedPrices.filter(
      (type): type is { id: number; label: string; price: number } => type.price !== null,
    ))
  }

  const priceType = nestedBook ? toNullableNumber(nestedBook.price_type) : null
  const availablePrice = nestedBook
    ? priceType === BookPriceTypeEnum.FREE
      ? 0
      : priceType === BookPriceTypeEnum.EBOOK
        ? toNullableNumber(nestedBook.ebook_price) ?? 0
        : priceType === BookPriceTypeEnum.PAPER
          ? toNullableNumber(nestedBook.paper_price) ?? 0
          : priceType === BookPriceTypeEnum.BOTH
            ? toNullableNumber(nestedBook.both_price) ?? 0
            : toNullableNumber(nestedBook.ebook_price)
              ?? toNullableNumber(nestedBook.paper_price)
              ?? toNullableNumber(nestedBook.both_price)
              ?? 0
    : null

  const nestedBookType = nestedBook ? toNullableNumber(nestedBook.type) : null
  const bookTypeLabel = nestedBookType === BookTypeEnum.EBOOK
    ? 'كتاب إلكتروني'
    : nestedBookType === BookTypeEnum.PAPER
      ? 'نسخة مطبوعة'
      : nestedBookType === BookTypeEnum.BOTH
        ? 'إلكتروني ومطبوع'
        : null
  const priceTypeLabel = priceType === BookPriceTypeEnum.FREE
    ? 'مجاني'
    : priceType === BookPriceTypeEnum.EBOOK
      ? 'نسخة إلكترونية'
      : priceType === BookPriceTypeEnum.PAPER
        ? 'نسخة مطبوعة'
        : priceType === BookPriceTypeEnum.BOTH
          ? 'النسختان'
          : null

  const steps = toArray(value.steps)
    .map((step, index) => {
      if (!isRecord(step)) return null
      const stepId = toNullableNumber(step.id)
      const stepTitle = toNullableString(step.title)
      if (stepId === null || !stepTitle) return null

      return {
        id: stepId,
        title: stepTitle,
        subtitle: toNullableString(step.subtitle),
        description: toNullableString(step.description),
        image: toSafeUrl(step.image),
        order: toNullableNumber(step.order) ?? index + 1,
      }
    })
    .filter((step): step is HomeBookStepViewModel => step !== null)
    .sort((first, second) => first.order - second.order)

  return {
    id,
    bookId: nestedBookId ?? toNullableNumber(value.book_id) ?? id,
    image: toNullableString(value.image) ?? (nestedBook ? toNullableString(nestedBook.image) : null),
    numberOfPages: toNullableNumber(value.number_of_pages),
    title,
    bookTitle: nestedBook ? toNullableString(nestedBook.title) ?? title : title,
    bookDescription: nestedBook
      ? toNullableString(nestedBook.description)
      : toNullableString(value.description),
    bookTypeLabel,
    priceTypeLabel,
    priceType: priceType as BookPriceTypeEnum | null,
    subtitle: toNullableString(value.subtitle),
    description: toNullableString(value.description),
    isFree: nestedBook
      ? priceType === BookPriceTypeEnum.FREE || availablePrice === 0
      : toNullableBoolean(value.isFree ?? value.is_free) ?? false,
    price: nestedBook ? String(availablePrice) : toNullableString(value.price) ?? '0',
    currency: nestedBook ? 'ج.م' : toNullableString(value.currency) ?? '',
    bookTypes,
    bookType: nestedBookType ?? toNullableNumber(value.book_type),
    invoiceLink: toSafeUrl(value.invoice_link),
    steps,
  }
}

export const mapBookDetails = (value: unknown): HomeBookDetailsViewModel | null => {
  const book = mapBook(value)
  if (!book || !isRecord(value)) {
    return null
  }

  const mapUrlList = (source: unknown): string[] =>
    toArray(source)
      .map(toSafeUrl)
      .filter((url): url is string => url !== null)

  return {
    ...book,
    attachments: toArray(value.attachments)
      .map((attachment) => {
        if (!isRecord(attachment)) return null

        const id = toNullableNumber(attachment.id)
        const file = toSafeUrl(attachment.file)
        if (id === null || !file) return null

        return {
          id,
          file,
          type: toNullableNumber(attachment.type),
        }
      })
      .filter((attachment): attachment is NonNullable<typeof attachment> => attachment !== null),
    startDate: toNullableString(value.start_date),
    endDate: toNullableString(value.end_date),
    images: mapUrlList(value.images),
    certificatesCount: toArray(value.certificates).length,
    videoLinks: mapUrlList(value.video_link),
    externalVideoLinks: mapUrlList(value.video_external_link),
    ratesCount: toArray(value.rates).length,
    videoLinksCount: toNullableNumber(value.number_of_video_link) ?? 0,
    offlineVideoLinksCount: toNullableNumber(value.number_of_offline_video_link) ?? 0,
    multimediaCount: toNullableNumber(value.multiMedia ?? value.multimedia) ?? 0,
    fees: toNullableNumber(value.fees) ?? 0,
    vat: toNullableNumber(value.vat) ?? 0,
    totalAfterDiscount: toNullableNumber(value.total_after_discount) ?? 0,
    isFavorite: toNullableBoolean(value.is_favorite) ?? false,
    allowStatus: toNullableNumber(value.allow_status) ?? 0,
    orderStatus: toNullableNumber(value.order_status) ?? 0,
    bookUrl: toSafeUrl(value.book_url),
    isFlipbook: toNullableNumber(value.is_flipbook) === 1,
    hasFreePreview: toNullableNumber(value.has_free) === 1,
    isFreeFlipbook: toNullableNumber(value.is_free_flipbook) === 1,
    freeBookUrl: toSafeUrl(value.free_book_url),
  }
}

const mapWebsiteSectionBook = (value: unknown): HomeWebsiteSectionBookViewModel | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = toNullableNumber(value.id)
  const title = toNullableString(value.title)
  if (id === null || !title) {
    return null
  }

  const steps = toArray(value.steps)
    .map((step, index) => {
      if (!isRecord(step)) return null

      const stepId = toNullableNumber(step.id)
      const stepTitle = toNullableString(step.title)
      if (stepId === null || !stepTitle) return null

      return {
        id: stepId,
        title: stepTitle,
        subtitle: toNullableString(step.subtitle),
        description: toNullableString(step.description),
        image: toSafeUrl(step.image),
        order: toNullableNumber(step.order) ?? index + 1,
      }
    })
    .filter((step): step is HomeBookStepViewModel => step !== null)
    .sort((first, second) => first.order - second.order)

  return {
    id,
    forHome: toNullableBoolean(value.for_home)
      ?? toNullableNumber(value.for_home) === 1,
    title,
    subtitle: toNullableString(value.subtitle),
    description: toNullableString(value.description),
    image: toSafeUrl(value.image),
    steps,
  }
}

export const mapBookDetailsResource = (
  value: unknown,
): HomeBookDetailsResourceViewModel | null => {
  if (!isRecord(value)) {
    return null
  }

  const book = mapBookDetails(value.book)
  if (!book) {
    return null
  }

  return {
    book,
    websiteSectionBook: mapWebsiteSectionBook(value.website_section_book),
  }
}

export const mapBooksPage = (value: unknown): HomeBooksViewModel => {
  if (Array.isArray(value)) {
    const items = value
      .map(mapBook)
      .filter((book): book is HomeBookViewModel => book !== null)

    return {
      items,
      pagination: {
        ...createEmptyBooksPagination(),
        perPage: items.length,
        total: items.length,
      },
    }
  }

  if (!isRecord(value)) {
    return createEmptyBooks()
  }

  const nestedBooks = value.books ?? value.items
  if (Array.isArray(nestedBooks)) {
    return mapBooksPage(nestedBooks)
  }

  const meta = isRecord(value.meta) ? value.meta : {}
  const links = isRecord(value.links) ? value.links : {}
  const currentPage = toNullableNumber(meta.current_page) ?? 1
  const lastPage = toNullableNumber(meta.last_page) ?? 1

  return {
    items: toArray(value.data)
      .map(mapBook)
      .filter((book): book is HomeBookViewModel => book !== null),
    pagination: {
      currentPage,
      lastPage,
      perPage: toNullableNumber(meta.per_page) ?? 10,
      total: toNullableNumber(meta.total) ?? 0,
      hasPreviousPage: Boolean(toNullableString(links.prev)) || currentPage > 1,
      hasNextPage: Boolean(toNullableString(links.next)) || currentPage < lastPage,
    },
  }
}

const mapLearningJourneyItem = (
  value: unknown,
  index: number,
): HomeLearningJourneyItemViewModel | null => {
  if (!isRecord(value)) {
    return null
  }

  const title = toNullableString(value.title ?? value.name ?? value.label)
  const description = toNullableString(
    value.description ?? value.text ?? value.subtitle ?? value.content,
  )

  if (!title || !description) {
    return null
  }

  return {
    id: toNullableNumber(value.id) ?? toNullableString(value.id) ?? index + 1,
    title,
    description,
  }
}

const mapLearningJourney = (
  value: unknown,
  site: HomeSiteViewModel,
): HomeLearningJourneyViewModel => {
  const fallbackSection = createHomeLearningJourneyMock(site)[0]
  const rootItems = toArray(value)
  const lastRootItem = rootItems[rootItems.length - 1]
  const section = isRecord(lastRootItem)
    ? lastRootItem
    : isRecord(value)
      ? value
      : fallbackSection

  const nestedItems = section.children
  const itemsSource = Array.isArray(nestedItems)
    ? nestedItems
    : fallbackSection.children
  const items = itemsSource
    .map(mapLearningJourneyItem)
    .filter((item): item is HomeLearningJourneyItemViewModel => item !== null)

  return {
    eyebrow: toNullableString(section.subtitle) ?? fallbackSection.subtitle,
    title: toNullableString(section.title) ?? fallbackSection.title,
    description: toNullableString(section.description) ?? fallbackSection.description,
    textBackground:
      toNullableString(section.text_background ?? section.textBackground) ??
      fallbackSection.text_background ??
      'PHYSICS',
    icon: mapImage(mapFlexibleImageApiDto(section.icon, section.title)),
    link: '/course',
    linkLabel: 'شاهد نموذج الطالب',
    items,
  }
}

const mapAboutTeacher = (
  value: unknown,
  site: HomeSiteViewModel,
): HomeAboutTeacherViewModel => {
  const fallbackSection = createHomeAboutTeacherMock()
  const rootItems = toArray(value)
  const lastRootItem = rootItems[rootItems.length - 1]
  const section = isRecord(lastRootItem)
    ? lastRootItem
    : isRecord(value)
      ? value
      : fallbackSection

  const fallbackExperience = fallbackSection.experience
  const experience = isRecord(section.experience) ? section.experience : fallbackExperience
  const rawBenefits = Array.isArray(section.benefits) && section.benefits.length > 0
    ? section.benefits
    : fallbackSection.benefits
  const benefits = rawBenefits.flatMap((item, index) => {
    if (!isRecord(item)) {
      return []
    }

    const fallbackBenefit = fallbackSection.benefits[index]
    const title = toNullableString(item.title) ?? fallbackBenefit?.title
    const description = toNullableString(item.description) ?? fallbackBenefit?.description

    if (!title || !description) {
      return []
    }

    return [{
      id: toNullableNumber(item.id) ?? fallbackBenefit?.id ?? index + 1,
      title,
      description,
    }]
  })

  const teacherName = site.brandName || 'مدرسك'

  return {
    id: toNullableNumber(section.id) ?? fallbackSection.id,
    title: toNullableString(section.title) ?? fallbackSection.title,
    subTitle: toNullableString(section.sub_title ?? section.subtitle) ?? fallbackSection.sub_title,
    description: toNullableString(section.description) ?? fallbackSection.description,
    icon: mapImage(mapFlexibleImageApiDto(section.icon, section.title)),
    experience: {
      value: toNullableString(experience.value) ?? fallbackExperience.value,
      prefix: toNullableString(experience.prefix) ?? fallbackExperience.prefix,
    },
    benefits,
    link: '/about-teacher',
    linkLabel: `اعرف أكثر عن ${teacherName}`,
  }
}

const createHomeCtaFallback = (): HomeCtaViewModel => ({
  eyebrow: 'جاهز تبدأ؟',
  title: 'اختار مسارك، وابدأ بخطوة واضحة.',
  description: 'الصفحة الجديدة ما زالت في وضع المعاينة، بينما يظل مسار التسجيل والكورسات الحالي متاحًا.',
})

const mapReadySection = (value: unknown): HomeCtaViewModel => {
  const fallback = createHomeCtaFallback()
  const rootItems = toArray(value)
  const lastRootItem = rootItems[rootItems.length - 1]
  const section: Record<string, unknown> = isRecord(lastRootItem)
    ? lastRootItem
    : isRecord(value)
      ? value
      : {}

  return {
    eyebrow: toNullableString(section.subtitle) ?? fallback.eyebrow,
    title: toNullableString(section.title) ?? fallback.title,
    description: toNullableString(section.description) ?? fallback.description,
  }
}

export const mapHomeLearningJourneyMock = (site: HomeSiteViewModel) =>
  mapLearningJourney(createHomeLearningJourneyMock(site), site)

export const mapHomeAboutTeacherMock = (site: HomeSiteViewModel) =>
  mapAboutTeacher(createHomeAboutTeacherMock(), site)

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
    image: null,
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
      image:
        mapImage(mapImageApiDto(settings.app_image)) ??
        mapImage(mapImageApiDto(settings.appImage)),
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
  books: {
    data: createEmptyBooks(),
    status: 'empty',
  },
  learningJourney: {
    data: mapHomeLearningJourneyMock(createEmptySite()),
    status: 'empty',
  },
  aboutTeacher: {
    data: mapHomeAboutTeacherMock(createEmptySite()),
    status: 'empty',
  },
  cta: {
    data: createHomeCtaFallback(),
    status: 'empty',
  },
})

export const mapHomePage = (sources: HomePageApiSources, settings: unknown): HomePageViewModel => {
  const site = mapHomeSite(settings)
  const hero = (() => {
    if (sources.heroSections.kind === 'success') {
      const customHero = mapHeroSection(
        sources.heroSections.data,
        HeroSectionTypeEnum.HOME_API_WEBSITE,
      )

      if (customHero) {
        return { data: customHero, status: 'success' as const }
      }
    }

    const mockHero = mapHeroSectionApiDto(createHomeHeroSectionMock(site)[0])
    const mockHeroViewModel = mockHero ? mapCustomHero(mockHero) : null

    if (sources.heroSections.kind === 'error') {
      return mapSectionError<HomeHeroViewModel | null>(mockHeroViewModel, sources.heroSections.error)
    }

    return { data: mockHeroViewModel, status: 'empty' as const }
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
      return {
        data: homeBlogsMock,
        status: 'success' as const,
      }
    }

    const mappedBlogs = toArray(sources.blogs.data)
      .map(mapBlogApiDto)
      .filter((blog): blog is HomeBlogApiDto => blog !== null)
      .map(mapBlog)
      .filter((blog): blog is HomeBlogViewModel => blog !== null)

    const visibleBlogs = mappedBlogs.length > 0 ? mappedBlogs : homeBlogsMock

    return {
      data: visibleBlogs,
      status: 'success' as const,
    }
  })()

  const books = (() => {
    if (sources.books.kind === 'error') {
      return mapSectionError<HomeBooksViewModel>(createEmptyBooks(), sources.books.error)
    }

    const mappedBooks = mapBooksPage(sources.books.data)

    return {
      data: mappedBooks,
      status: mappedBooks.items.length > 0 ? ('success' as const) : ('empty' as const),
    }
  })()

  const learningJourney = (() => {
    if (sources.learningJourney.kind === 'error') {
      return {
        data: mapHomeLearningJourneyMock(site),
        status: 'empty' as const,
      }
    }

    const hasApiData =
      (Array.isArray(sources.learningJourney.data) &&
        sources.learningJourney.data.length > 0) ||
      (isRecord(sources.learningJourney.data) &&
        Object.keys(sources.learningJourney.data).length > 0)

    return {
      data: mapLearningJourney(sources.learningJourney.data, site),
      status: hasApiData ? ('success' as const) : ('empty' as const),
    }
  })()

  const aboutTeacher = (() => {
    if (sources.aboutTeacher.kind === 'error') {
      return {
        data: mapHomeAboutTeacherMock(site),
        status: 'empty' as const,
      }
    }

    const hasApiData =
      (Array.isArray(sources.aboutTeacher.data) &&
        sources.aboutTeacher.data.length > 0) ||
      (isRecord(sources.aboutTeacher.data) &&
        Object.keys(sources.aboutTeacher.data).length > 0)

    return {
      data: mapAboutTeacher(sources.aboutTeacher.data, site),
      status: hasApiData ? ('success' as const) : ('empty' as const),
    }
  })()

  const cta = (() => {
    const hasApiData =
      sources.readySection.kind === 'success' &&
      ((Array.isArray(sources.readySection.data) && sources.readySection.data.length > 0) ||
        (isRecord(sources.readySection.data) && Object.keys(sources.readySection.data).length > 0))

    return {
      data: mapReadySection(
        sources.readySection.kind === 'success' ? sources.readySection.data : null,
      ),
      status: hasApiData ? ('success' as const) : ('empty' as const),
    }
  })()

  return {
    site,
    hero,
    courses,
    blogs,
    books,
    learningJourney,
    aboutTeacher,
    cta,
  }
}
