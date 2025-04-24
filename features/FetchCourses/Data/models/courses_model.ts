import type TitleModel from "~/base/core/Models/title_model";
import type TeacherModel from "~/features/FetchCourseDetails/Data/models/teacher_model";

export default class CoursesModel {
  public id: number;
  public title: string;
  public subtitle: string;
  public subject: TitleModel;
  public img: string;
  public videos_number: number;
  public docs_number: number;
  public progress: number;
  public teacher: TeacherModel;

  constructor(
    id: number,
    title: string,
    subtitle: string,
    subject: TitleModel,
    img: string,
    videos_number: number,
    docs_number: number,
    progress: number,
    teacher: TeacherModel,

  ) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.subject = subject;
    this.img = img;
    this.videos_number = videos_number;
    this.docs_number = docs_number;
    this.progress = progress;
    this.teacher = teacher;
 
  }


  static fromMap(map: { [key: string]: any }): CoursesModel {
    return new CoursesModel(
      map["id"],
      map["title"],
      map["subtitle"],
      map["subject"],
      map["img"],
      map["videos_number"],
      map["docs_number"],
      map["progress"],
      map["teacher"],

    );
  }
}
