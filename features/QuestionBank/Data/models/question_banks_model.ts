export interface QuestionBankImage {
  img: string;
  alt: string;
}

export interface QuestionBankTeacher {
  id: number;
  name: string;
  image: QuestionBankImage | null;
}

const toNumber = (value: unknown): number => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const toText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const normalizeImageUrl = (value: unknown): string => {
  const source = toText(value);
  const markdownUrl = source.match(/^\[[^\]]*\]\((https?:\/\/[^)]+)\)$/u);
  return markdownUrl?.[1] || source;
};

const mapImage = (value: unknown): QuestionBankImage | null => {
  if (!value || typeof value !== "object") return null;

  const image = value as Record<string, unknown>;
  const src = normalizeImageUrl(image.img ?? image.src ?? image.url);
  if (!src) return null;

  return {
    img: src,
    alt: toText(image.alt),
  };
};

const mapTeacher = (value: unknown): QuestionBankTeacher | null => {
  if (!value || typeof value !== "object") return null;

  const teacher = value as Record<string, unknown>;
  return {
    id: toNumber(teacher.id),
    name: toText(teacher.name),
    image: mapImage(teacher.image),
  };
};

export default class QuestionBankModel {
  constructor(
    public id: number,
    public centerId: number | null,
    public teacher: QuestionBankTeacher | null,
    public monthPrice: number,
    public currency: string,
    public isActive: boolean,
    public image: QuestionBankImage | null,
    public title: string,
    public description: string,
    public isSubscribed: boolean,
    public subscriptionStatus: string | null,
    public subscription: unknown,
  ) {}

  static fromMap(map: Record<string, unknown>): QuestionBankModel {
    return new QuestionBankModel(
      toNumber(map.id),
      map.center_id == null ? null : toNumber(map.center_id),
      mapTeacher(map.teacher_id),
      toNumber(map.month_price),
      toText(map.currency) || "L.E",
      Boolean(map.is_active),
      mapImage(map.image),
      toText(map.title) || "بنك أسئلة",
      toText(map.description),
      Boolean(map.is_subscribed),
      map.subscription_status == null
        ? null
        : toText(map.subscription_status),
      map.subscription ?? null,
    );
  }
}
