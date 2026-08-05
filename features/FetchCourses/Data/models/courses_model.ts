import type TitleModel from "~/base/core/Models/title_model";
import type TeacherModel from "~/features/FetchCourseDetails/Data/models/teacher_model";

export default class CoursesModel {
  public id: number;
  public title: string;
  public subtitle: string;
  public subject: TitleModel;
  public image: {
    img: string;
    alt: string;
  };
  public videos_number: number;
  public docs_number: number;
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
    videos_number: number,
    docs_number: number,
    is_last: boolean,
    percentage: number,
    teacher: TeacherModel,
  ) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.subject = subject;
    this.image = image;
    this.videos_number = videos_number;
    this.docs_number = docs_number;
    this.is_last = is_last;
    this.percentage = percentage;
    this.progress = percentage;
    this.teacher = teacher;
  }

  static fromMap(map: { [key: string]: any }): CoursesModel {
    const rawPercentage = Number(map["percentage"] ?? map["progress"] ?? 0);
    const percentage = Number.isFinite(rawPercentage)
      ? Math.min(100, Math.max(0, rawPercentage))
      : 0;
    const isLast = map["is_last"] === true;

    return new CoursesModel(
      map["id"],
      map["title"],
      map["subtitle"],
      map["subject"],
      map["image"],
      map["videos_number"],
      map["docs_number"],
      isLast,
      percentage,
      map["teacher"],
    );
  }
}
