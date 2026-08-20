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
  HomeCoursePageViewModel,
  HomeCourseTabViewModel,
  HomeCourseStageViewModel,
  HomeCourseViewModel,
  HomeCoursesViewModel,
  HomeHeroViewModel,
  HomeImageViewModel,
  HomeLearningJourneyItemViewModel,
  HomeLearningJourneyViewModel,
  HomePageViewModel,
  HomeSiteViewModel,
  HomeSubjectViewModel,
  HomeTeacherViewModel,
  HomeWebsiteSectionBookViewModel,
} from '../models/HomePageViewModel'
import { BookPriceTypeEnum, BookTypeEnum } from '../models/HomePageViewModel'

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

export const mapHomeTeachers = (value: unknown): HomeTeacherViewModel[] =>
  toArray(value)
    .map((item): HomeTeacherViewModel | null => {
      if (!isRecord(item)) return null

      const id = toNullableNumber(item.id)
      const name = toNullableString(item.name)
      if (id === null || !name) return null

      return {
        id,
        name,
        image: mapImage(mapFlexibleImageApiDto(item.image, name)),
        intro: toNullableString(item.intro),
        shortDescription: toNullableString(item.mini_description),
        description: toNullableString(item.description),
        address: toNullableString(item.address),
        email: toNullableString(item.email),
        phone: toNullableString(item.phone),
        coursesCount: toNullableNumber(item.number_of_courses) ?? 0,
        revisionsCount: toNullableNumber(item.number_of_revisions) ?? 0,
      }
    })
    .filter((teacher): teacher is HomeTeacherViewModel => teacher !== null)

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
      value.image_alt ?? value.alt ?? media?.alt,
    ),
    mobileImage: mapFlexibleImageApiDto(
      value.mobile_image ?? value.mobile_img ?? media?.mobileImage ?? media?.mobile_img,
      value.mobile_image_alt ?? value.mobile_alt ?? media?.mobile_alt ?? media?.alt,
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
    mailImage: mapFlexibleImageApiDto(value.mail_image, value.title),
    attachments: toArray(value.attachments)
      .map((attachment) => {
        if (!isRecord(attachment)) return null

        return mapFlexibleImageApiDto(
          attachment.file ?? attachment.img,
          attachment.alt ?? value.title,
        )
      })
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

const createEmptyCoursePage = (): HomeCoursePageViewModel => ({
  courses: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 9,
    total: 0,
    serverDriven: false,
  },
})

export const mapHomeCoursePage = (
  value: unknown,
  requestedPage = 1,
  requestedPerPage = 9,
  allowedSubjectIds?: ReadonlySet<number>,
): HomeCoursePageViewModel => {
  const record = isRecord(value) ? value : null
  const nestedData = record && isRecord(record.data) ? record.data : null
  const courseSource = Array.isArray(value)
    ? value
    : Array.isArray(record?.data)
      ? record.data
      : Array.isArray(nestedData?.data)
        ? nestedData.data
        : []
  const metadataSource = nestedData ?? record
  const metadata = metadataSource && isRecord(metadataSource.meta)
    ? metadataSource.meta
    : metadataSource
  const hasServerPagination = Boolean(
    metadata &&
      (metadata.current_page !== undefined ||
        metadata.last_page !== undefined ||
        metadata.total !== undefined),
  )
  const allCourses = mapHomeCourseList(courseSource).filter((course) =>
    !allowedSubjectIds ||
    (course.sourceSubject?.id !== null &&
      course.sourceSubject?.id !== undefined &&
      allowedSubjectIds.has(course.sourceSubject.id)),
  )
  const safePerPage = Math.max(
    1,
    toNullableNumber(metadata?.per_page) ?? requestedPerPage,
  )
  const total = Math.max(
    0,
    toNullableNumber(metadata?.total) ?? allCourses.length,
  )
  const computedLastPage = Math.max(1, Math.ceil(total / safePerPage))
  const lastPage = Math.max(
    1,
    toNullableNumber(metadata?.last_page) ?? computedLastPage,
  )
  const currentPage = Math.min(
    lastPage,
    Math.max(1, toNullableNumber(metadata?.current_page) ?? requestedPage),
  )
  const courses = hasServerPagination
    ? allCourses
    : allCourses.slice(
        (currentPage - 1) * safePerPage,
        currentPage * safePerPage,
      )

  return {
    courses,
    pagination: {
      currentPage,
      lastPage,
      perPage: safePerPage,
      total,
      serverDriven: hasServerPagination,
    },
  }
}

export const mapHomeCourseSubjectIds = (value: unknown): Set<number> => {
  const subjectIds = new Set<number>()

  toArray(value).forEach((item) => {
    if (!isRecord(item)) return

    const id = toNullableNumber(item.id)
    if (id !== null) subjectIds.add(id)
  })

  return subjectIds
}

export const mapHomeSubjects = (value: unknown): HomeSubjectViewModel[] => {
  const subjects = new Map<number, HomeSubjectViewModel>()

  toArray(value).forEach((item) => {
    if (!isRecord(item)) return

    const id = toNullableNumber(item.id)
    const label = toNullableString(item.title ?? item.label ?? item.name)
    if (id === null || !label || subjects.has(id)) return

    subjects.set(id, { id, label })
  })

  return [...subjects.values()]
}

export const mapHomeCourseStages = (value: unknown): HomeCourseStageViewModel[] => {
  const stages = new Map<number, HomeCourseStageViewModel>()

  toArray(value).forEach((item) => {
    if (!isRecord(item)) return

    const id = toNullableNumber(item.id)
    const label = toNullableString(item.title ?? item.label ?? item.name)
    if (id === null || !label || stages.has(id)) return

    stages.set(id, { id, label })
  })

  return [...stages.values()]
}

export const mapHomeCourseYears = (
  stage: HomeCourseStageViewModel,
  value: unknown,
): HomeCourseTabViewModel[] => {
  const years = new Map<number, HomeCourseTabViewModel>()

  toArray(value).forEach((item) => {
    if (!isRecord(item)) return

    const yearId = toNullableNumber(item.id)
    const label = toNullableString(item.title ?? item.label ?? item.name)
    if (yearId === null || !label || years.has(yearId)) return

    years.set(yearId, {
      key: `stage-${stage.id}-year-${yearId}`,
      label,
      stageId: stage.id,
      stageLabel: stage.label,
      yearId,
      courses: [],
    })
  })

  return [...years.values()]
}

const createEmptyCourses = (): HomeCoursesViewModel => ({
  mode: 'education',
  stages: [],
  tabs: [],
  taxonomyStatus: 'loading',
  taxonomyError: null,
  unassignedCourses: [],
  generalCatalog: createEmptyCoursePage(),
  generalCatalogStatus: 'loading',
  generalCatalogError: null,
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
    mode: 'education',
    stages: [],
    tabs: [],
    taxonomyStatus: 'loading',
    taxonomyError: null,
    unassignedCourses: [...uniqueCourses.values()],
    generalCatalog: createEmptyCoursePage(),
    generalCatalogStatus: 'loading',
    generalCatalogError: null,
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
    image: mapImage(blog.attachments[0] ?? blog.mailImage),
  }
}

export const mapBlogsPage = (value: unknown): HomeBlogViewModel[] => {
  const blogItems = Array.isArray(value)
    ? value
    : isRecord(value)
      ? toArray(value.data ?? value.items ?? value.blogs)
      : []

  return blogItems
    .map(mapBlogApiDto)
    .filter((blog): blog is HomeBlogApiDto => blog !== null)
    .map(mapBlog)
    .filter((blog): blog is HomeBlogViewModel => blog !== null)
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
    currency: toNullableString(value.currency ?? (nestedBook ? nestedBook.currency : null)) ?? '',
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
): HomeLearningJourneyViewModel => {
  const rootItems = toArray(value)
  const lastRootItem = rootItems[rootItems.length - 1]
  const section: Record<string, unknown> = isRecord(lastRootItem)
    ? lastRootItem
    : isRecord(value)
      ? value
      : {}

  const nestedItems = section.children
  const itemsSource = Array.isArray(nestedItems) ? nestedItems : []
  const items = itemsSource
    .map(mapLearningJourneyItem)
    .filter((item): item is HomeLearningJourneyItemViewModel => item !== null)

  return {
    eyebrow: toNullableString(section.subtitle) ?? '',
    title: toNullableString(section.title) ?? '',
    description: toNullableString(section.description) ?? '',
    textBackground: toNullableString(section.text_background ?? section.textBackground) ?? '',
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
  const rootItems = toArray(value)
  const lastRootItem = rootItems[rootItems.length - 1]
  const section: Record<string, unknown> = isRecord(lastRootItem)
    ? lastRootItem
    : isRecord(value)
      ? value
      : {}

  const experience: Record<string, unknown> = isRecord(section.experience)
    ? section.experience
    : {}
  const rawBenefits = Array.isArray(section.benefits) ? section.benefits : []
  const benefits = rawBenefits.flatMap((item, index) => {
    if (!isRecord(item)) {
      return []
    }

    const title = toNullableString(item.title)
    const description = toNullableString(item.description)

    // The about-teacher endpoint may return concise benefits with a title only.
    // Keep those items instead of dropping the entire benefits list.
    if (!title) {
      return []
    }

    return [{
      id: toNullableNumber(item.id) ?? index + 1,
      title,
      description: description ?? '',
    }]
  })

  const teacherName = site.brandName

  return {
    id: toNullableNumber(section.id) ?? 0,
    title: toNullableString(section.title) ?? '',
    subTitle: toNullableString(section.sub_title ?? section.subtitle) ?? '',
    description: toNullableString(section.description) ?? '',
    icon: mapImage(mapFlexibleImageApiDto(section.icon, section.title)),
    experience: {
      value: toNullableString(experience.value) ?? '',
      prefix: toNullableString(experience.prefix) ?? '',
    },
    benefits,
    link: '/about-teacher',
    linkLabel: teacherName ? `اعرف أكثر عن ${teacherName}` : 'اعرف أكثر عن المدرس',
  }
}

const createEmptyHomeCta = (): HomeCtaViewModel => ({
  eyebrow: '',
  title: '',
  description: '',
})

const mapReadySection = (value: unknown): HomeCtaViewModel => {
  const rootItems = toArray(value)
  const lastRootItem = rootItems[rootItems.length - 1]
  const section: Record<string, unknown> = isRecord(lastRootItem)
    ? lastRootItem
    : isRecord(value)
      ? value
      : {}

  return {
    eyebrow: toNullableString(section.subtitle) ?? '',
    title: toNullableString(section.title) ?? '',
    description: toNullableString(section.description) ?? '',
  }
}

const createEmptyLearningJourney = (): HomeLearningJourneyViewModel =>
  mapLearningJourney(null)

const createEmptyAboutTeacher = (site: HomeSiteViewModel): HomeAboutTeacherViewModel =>
  mapAboutTeacher(null, site)

const mapSectionError = <T>(data: T, error: HomeSectionState<T>['error']): HomeSectionState<T> => ({
  data,
  status: 'error',
  error: error ?? { type: 'unknown', message: DEFAULT_HOME_ERROR_MESSAGE },
})

const createEmptySite = (): HomeSiteViewModel => ({
  isGeneral: false,
  categoryIds: [],
  brandName: null,
  description: null,
  metaTitle: null,
  metaDescription: null,
  metaKeywords: null,
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
    isGeneral: toNullableNumber(settings.has_general) === 1,
    categoryIds: toArray(settings.categories)
      .map(toNullableNumber)
      .filter((id): id is number => id !== null),
    brandName: toNullableString(settings.name),
    description: toNullableString(settings.description),
    metaTitle: toNullableString(settings.meta_title),
    metaDescription: toNullableString(settings.meta_description),
    metaKeywords: toNullableString(settings.meta_keywords),
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
  teachers: {
    data: [],
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
    data: createEmptyLearningJourney(),
    status: 'empty',
  },
  aboutTeacher: {
    data: createEmptyAboutTeacher(createEmptySite()),
    status: 'empty',
  },
  cta: {
    data: createEmptyHomeCta(),
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

    if (sources.heroSections.kind === 'error') {
      return mapSectionError<HomeHeroViewModel | null>(null, sources.heroSections.error)
    }

    return { data: null, status: 'empty' as const }
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

    const mappedBlogs = mapBlogsPage(sources.blogs.data)

    return {
      data: mappedBlogs,
      status: mappedBlogs.length > 0 ? ('success' as const) : ('empty' as const),
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
      return mapSectionError<HomeLearningJourneyViewModel>(
        createEmptyLearningJourney(),
        sources.learningJourney.error,
      )
    }

    const data = mapLearningJourney(sources.learningJourney.data)
    const hasApiData = Boolean(
      data.eyebrow ||
      data.title ||
      data.description ||
      data.icon ||
      data.items.length > 0,
    )

    return {
      data,
      status: hasApiData ? ('success' as const) : ('empty' as const),
    }
  })()

  const aboutTeacher = (() => {
    if (sources.aboutTeacher.kind === 'error') {
      return mapSectionError<HomeAboutTeacherViewModel>(
        createEmptyAboutTeacher(site),
        sources.aboutTeacher.error,
      )
    }

    const data = mapAboutTeacher(sources.aboutTeacher.data, site)
    const hasApiData = Boolean(
      data.title ||
      data.subTitle ||
      data.description ||
      data.icon ||
      data.experience.value ||
      data.experience.prefix ||
      data.benefits.length > 0,
    )

    return {
      data,
      status: hasApiData ? ('success' as const) : ('empty' as const),
    }
  })()

  const cta = (() => {
    if (sources.readySection.kind === 'error') {
      return mapSectionError<HomeCtaViewModel>(
        createEmptyHomeCta(),
        sources.readySection.error,
      )
    }

    const data = mapReadySection(sources.readySection.data)
    const hasApiData = Boolean(data.eyebrow || data.title || data.description)

    return {
      data,
      status: hasApiData ? ('success' as const) : ('empty' as const),
    }
  })()

  return {
    site,
    hero,
    courses,
    teachers: {
      data: [],
      status: 'empty',
    },
    blogs,
    books,
    learningJourney,
    aboutTeacher,
    cta,
  }
}
