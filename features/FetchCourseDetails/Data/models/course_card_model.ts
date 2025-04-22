import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type ImageModel from "./image_model";
import type TitleModel from "~/base/core/Models/title_model";
import type TeacherModel from "./teacher_model";

export default class CourseCardModel {
  public id: number;
  public title: string; 
  public description: string; 
  public Image: ImageModel; 
  public CoursePrice: number; 
  public Subject:TitleModel;
  public Teacher:TeacherModel;


  constructor(
    id: number,
    title: string, 
    description: string, 
    Image: ImageModel,
    CoursePrice: number, 
    Subject:TitleModel,
    Teacher:TeacherModel,

  ) {
    this.id = id;
    this.title = title; 
    this.description = description; 
    this.Image = Image;
    this.CoursePrice = CoursePrice; 
    this.Subject = Subject;
    this.Teacher = Teacher;
 
  }


  static fromMap(map: { [key: string]: any }): CourseCardModel {
    return new CourseCardModel(
        map["id"],
        map["title"],
        map["description"],
        map["image"],
        map["course_price"],
        map["subject"],
        map["teacher"],
    );
  }
}



