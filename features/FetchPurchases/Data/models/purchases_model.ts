export type PurchaseKind = "course" | "book" | "questionBank" | "package";

interface PurchasedItemBase {
  id: number;
  kind: PurchaseKind;
  title: string;
  description: string;
  image: string | null;
  price: number | null;
  currency: string;
  orderStatus: number | null;
  invoiceLink: string | null;
}

export interface PurchasedCourse extends PurchasedItemBase {
  kind: "course";
  courseId: number;
  subjectTitle: string;
  teacherName: string;
  videoCount: number;
  pdfCount: number;
  audioCount: number;
  progress: number;
  allowStatus: number | null;
  isPaid: boolean;
  isBlocked: boolean;
  fromDate: string | null;
  toDate: string | null;
}

export interface PurchasedBook extends PurchasedItemBase {
  kind: "book";
  bookId: number;
  pageCount: number;
  priceType: number | null;
  bookType: number | null;
  isFree: boolean;
  allowStatus: number | null;
  hasFreePreview: boolean;
  freeBookUrl: string | null;
}

export interface PurchasedQuestionBank extends PurchasedItemBase {
  kind: "questionBank";
  questionBankId: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  remainingQuestions: number;
  subscriptionPoints: number;
  subscriptionDuration: number;
  isPaid: boolean;
  status: number | null;
}

export interface PurchasedPackageEntry {
  id: number;
  title: string;
}

export interface PurchasedPackage extends PurchasedItemBase {
  kind: "package";
  packageId: number;
  isSubscribed: boolean;
  totalCourses: number;
  totalQuestionBanks: number;
  courses: PurchasedPackageEntry[];
  questionBanks: PurchasedPackageEntry[];
}

export type PurchasedItem =
  | PurchasedCourse
  | PurchasedBook
  | PurchasedQuestionBank
  | PurchasedPackage;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const toText = (value: unknown, fallback = ""): string =>
  typeof value === "string" || typeof value === "number"
    ? String(value).trim()
    : fallback;

const toNumber = (value: unknown, fallback = 0): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const toCount = (value: unknown): number => Math.max(0, toNumber(value));

const toBoolean = (value: unknown): boolean =>
  value === true || value === 1 || value === "1" || value === "true";

const toSafeUrl = (value: unknown): string | null => {
  const url = toText(value);
  if (!url) return null;
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
};

const toImage = (value: unknown): string | null => {
  if (isRecord(value)) {
    return toSafeUrl(value.img ?? value.src ?? value.url);
  }
  return toSafeUrl(value);
};

const mapPackageEntry = (value: unknown): PurchasedPackageEntry | null => {
  if (!isRecord(value)) return null;
  const id = toNumber(
    value.course_id ?? value.book_id ?? value.question_bank_id ?? value.id,
    -1,
  );
  const title = toText(value.title);
  return id >= 0 && title ? { id, title } : null;
};

const mapCourse = (value: unknown): PurchasedCourse | null => {
  if (!isRecord(value)) return null;
  const id = toNumber(value.id, -1);
  const courseId = toNumber(value.course_id ?? value.id, -1);
  const title = toText(value.title);
  if (id < 0 || courseId < 0 || !title) return null;

  return {
    id,
    kind: "course",
    courseId,
    title,
    description: toText(value.description ?? value.text ?? value.subtitle),
    image: toImage(value.image),
    price: toNullableNumber(value.price),
    currency: toText(value.currency),
    orderStatus: toNullableNumber(value.order_status),
    invoiceLink: toSafeUrl(value.invoice_link),
    subjectTitle: toText(value.subject_full_title ?? value.subject_title),
    teacherName: toText(value.teacher_name),
    videoCount: toCount(value.number_of_videos ?? value.course_videos),
    pdfCount: toCount(value.number_of_pdfs ?? value.course_docs),
    audioCount: toCount(value.audio_count ?? value.course_records),
    progress: Math.min(100, Math.max(0, toNumber(value.percentage ?? value.progress))),
    allowStatus: toNullableNumber(value.allow_status),
    isPaid: toBoolean(value.is_paid),
    isBlocked: toBoolean(value.is_blocked),
    fromDate: toText(value.from_date) || null,
    toDate: toText(value.to_date) || null,
  };
};

const mapBook = (value: unknown): PurchasedBook | null => {
  if (!isRecord(value)) return null;
  const id = toNumber(value.id, -1);
  const bookId = toNumber(value.book_id ?? value.id, -1);
  const title = toText(value.title);
  if (id < 0 || bookId < 0 || !title) return null;

  return {
    id,
    kind: "book",
    bookId,
    title,
    description: toText(value.description ?? value.subtitle),
    image: toImage(value.image),
    price: toNullableNumber(value.price),
    currency: toText(value.currency),
    orderStatus: toNullableNumber(value.order_status),
    invoiceLink: toSafeUrl(value.invoice_link),
    pageCount: toCount(value.number_of_pages),
    priceType: toNullableNumber(value.price_type),
    bookType: toNullableNumber(value.type ?? value.book_type),
    isFree: toBoolean(value.isFree ?? value.is_free),
    allowStatus: toNullableNumber(value.allow_status),
    hasFreePreview: toBoolean(value.has_free ?? value.is_free_flipbook),
    freeBookUrl: toSafeUrl(value.free_book_url),
  };
};

const mapQuestionBank = (value: unknown): PurchasedQuestionBank | null => {
  if (!isRecord(value)) return null;
  const id = toNumber(value.id, -1);
  const questionBankId = toNumber(value.question_bank_id ?? value.id, -1);
  const title = toText(value.title);
  if (id < 0 || questionBankId < 0 || !title) return null;

  return {
    id,
    kind: "questionBank",
    questionBankId,
    title,
    description: toText(value.description),
    image: toImage(value.image),
    price: toNullableNumber(value.price),
    currency: toText(value.currency),
    orderStatus: toNullableNumber(value.order_status),
    invoiceLink: toSafeUrl(value.invoice_link),
    totalQuestions: toCount(value.all_questions),
    correctAnswers: toCount(value.correct_answers),
    wrongAnswers: toCount(value.wrong_answers),
    remainingQuestions: toCount(value.rest_questions),
    subscriptionPoints: toCount(value.subscription_points),
    subscriptionDuration: toCount(value.subscription_duration),
    isPaid: toBoolean(value.is_paid),
    status: toNullableNumber(value.status),
  };
};

const mapPackage = (value: unknown): PurchasedPackage | null => {
  if (!isRecord(value)) return null;
  const id = toNumber(value.id, -1);
  const packageId = toNumber(value.package_id ?? value.id, -1);
  const title = toText(value.title);
  if (id < 0 || packageId < 0 || !title) return null;

  const courses = toArray(value.courses)
    .map(mapPackageEntry)
    .filter((item): item is PurchasedPackageEntry => item !== null);
  const questionBanks = toArray(value.question_banks)
    .map(mapPackageEntry)
    .filter((item): item is PurchasedPackageEntry => item !== null);

  return {
    id,
    kind: "package",
    packageId,
    title,
    description: toText(value.description),
    image: toImage(value.image),
    price: toNullableNumber(value.price_after_discount ?? value.price),
    currency: toText(value.currency),
    orderStatus: toNullableNumber(value.order_status),
    invoiceLink: toSafeUrl(value.invoice_link),
    isSubscribed: toBoolean(value.is_subscribed),
    totalCourses: toCount(value.totalCourses ?? value.total_courses) || courses.length,
    totalQuestionBanks:
      toCount(value.totalQuestionBanks ?? value.total_question_banks) ||
      questionBanks.length,
    courses,
    questionBanks,
  };
};

const mapList = <T>(value: unknown, mapper: (item: unknown) => T | null): T[] =>
  toArray(value)
    .map(mapper)
    .filter((item): item is T => item !== null);

export default class PurchasesModel {
  books: PurchasedBook[];
  questionBanks: PurchasedQuestionBank[];
  courses: PurchasedCourse[];
  packages: PurchasedPackage[];

  constructor(
    books: PurchasedBook[],
    questionBanks: PurchasedQuestionBank[],
    courses: PurchasedCourse[],
    packages: PurchasedPackage[],
  ) {
    this.books = books;
    this.questionBanks = questionBanks;
    this.courses = courses;
    this.packages = packages;
  }

  get totalItems(): number {
    return (
      this.books.length +
      this.questionBanks.length +
      this.courses.length +
      this.packages.length
    );
  }

  static empty(): PurchasesModel {
    return new PurchasesModel([], [], [], []);
  }

  static fromMap(value: unknown): PurchasesModel {
    if (!isRecord(value)) return PurchasesModel.empty();

    return new PurchasesModel(
      mapList(value.books, mapBook),
      mapList(value.question_banks, mapQuestionBank),
      mapList(value.courses, mapCourse),
      mapList(value.packages, mapPackage),
    );
  }
}
