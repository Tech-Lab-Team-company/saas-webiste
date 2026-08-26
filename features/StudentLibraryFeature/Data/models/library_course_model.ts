import {
  imageUrl,
  isRecord,
  nestedRecord,
  toNumber,
  toText,
  type UnknownRecord,
} from "./library_item_utils";

export default class LibraryCourseModel {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly image: string | null,
    public readonly subject: string,
    public readonly teacherName: string,
    public readonly videoCount: number,
    public readonly documentCount: number,
    public readonly audioCount: number,
    public readonly progress: number,
  ) {}

  static fromMap(record: UnknownRecord): LibraryCourseModel | null {
    const course = nestedRecord(record, "course", "favoritable", "favoriteable", "item");
    const id = toNumber(record.course_id ?? course.id ?? record.id, -1);
    const title = toText(course.title ?? record.title ?? record.name);
    if (id < 0 || !title) return null;

    const subject = isRecord(course.subject)
      ? toText(course.subject.title)
      : toText(course.subject ?? record.subject_full_title ?? record.subject_title);
    const teacher = isRecord(course.teacher)
      ? toText(course.teacher.name)
      : toText(course.teacher ?? record.teacher_name);
    const rawProgress = toNumber(course.percentage ?? course.progress ?? record.percentage ?? record.progress);

    return new LibraryCourseModel(
      id,
      title,
      toText(course.description ?? course.subtitle ?? record.description ?? record.subtitle),
      imageUrl(course.image ?? record.image),
      subject,
      teacher,
      Math.max(0, toNumber(course.course_videos ?? course.number_of_videos ?? record.course_videos ?? record.number_of_videos)),
      Math.max(0, toNumber(course.course_docs ?? course.number_of_pdfs ?? record.course_docs ?? record.number_of_pdfs)),
      Math.max(0, toNumber(course.course_records ?? course.audio_count ?? record.course_records ?? record.audio_count)),
      Math.min(100, Math.max(0, rawProgress)),
    );
  }
}
