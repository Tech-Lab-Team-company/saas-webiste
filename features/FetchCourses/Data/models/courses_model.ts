import type TitleModel from "~/base/core/Models/title_model";
import type TeacherModel from "~/features/FetchCourseDetails/Data/models/teacher_model";

export default class CoursesModel {
  public id: number;
  public title: string;
  public subtitle: string;
  public description: string;
  public subject: TitleModel;
  public image: {
    img: string;
    alt: string;
  };
  public course_videos: number;
  public course_docs: number;
  public course_records: number;
  /** @deprecated Use course_videos. Kept for older course-card consumers. */
  public videos_number: number;
  /** @deprecated Use course_docs. Kept for older course-card consumers. */
  public docs_number: number;
  /** @deprecated Use course_records. Kept for older course-card consumers. */
  public records_number: number;
  public is_last: boolean;
  public percentage: number;
  /** @deprecated Use percentage. Kept for older course-card consumers. */
  public progress: number;
  public teacher: TeacherModel;

  constructor(
    id: number,
    title: string,
    subtitle: string,
    subject: TitleModel,
    image: {
      img: string;
      alt: string;
    },
    course_videos: number,
    course_docs: number,
    course_records: number,
    is_last: boolean,
    percentage: number,
    teacher: TeacherModel,
  ) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.description = subtitle;
    this.subject = subject;
    this.image = image;
    this.course_videos = course_videos;
    this.course_docs = course_docs;
    this.course_records = course_records;
    this.videos_number = course_videos;
    this.docs_number = course_docs;
    this.records_number = course_records;
    this.is_last = is_last;
    this.percentage = percentage;
    this.progress = percentage;
    this.teacher = teacher;
  }

  static fromMap(map: { [key: string]: any }): CoursesModel {
    const toSafeCount = (value: unknown): number => {
      const count = Number(value ?? 0);
      return Number.isFinite(count) ? Math.max(0, count) : 0;
    };
    const rawPercentage = Number(map["percentage"] ?? map["progress"] ?? 0);
    const percentage = Number.isFinite(rawPercentage)
      ? Math.min(100, Math.max(0, rawPercentage))
      : 0;
    const isLast =
      map["is_last"] === true ||
      map["is_last"] === 1 ||
      map["is_last"] === "1";

    return new CoursesModel(
      map["id"],
      map["title"],
      map["subtitle"] ?? map["description"] ?? "",
      map["subject"],
      map["image"],
      toSafeCount(map["course_videos"] ?? map["videos_number"]),
      toSafeCount(map["course_docs"] ?? map["docs_number"]),
      toSafeCount(map["course_records"] ?? map["records_number"]),
      isLast,
      percentage,
      map["teacher"],
    );
  }
}
