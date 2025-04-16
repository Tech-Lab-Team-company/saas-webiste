import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type ImageModel from "./image_model";
import type TitleModel from "~/base/core/Models/title_model";
import type TeacherModel from "./teacher_model";
import type UnitsModel from "./units_model";
import type ExamsModel from "./exam_model";

export default class CourseDetailsModel {
  public id: number;
  public title: string; // Use 'string' instead of 'String'
  public description: string; 
  public Image: ImageModel; 
  public CoursePrice: number; 
  public Subject:TitleModel;
  public Teacher:TeacherModel;
  public Exams:ExamsModel[];
  public StageType:number;
  public ExternalLinks: [];
  public Lives: [];
  public Homeworks: [];
  public Sessions: [];
  public Lessons: [];
  public units: UnitsModel[];



  constructor(
    id: number,
    title: string,
    description: string,
    Image: ImageModel,
    CoursePrice: number,
    Subject: TitleModel,
    Teacher: TeacherModel,
    Exams: ExamsModel[],
    StageType: number,
    ExternalLinks: [],
    Lives: [],
    Homeworks: [],
    Sessions: [],
    Lessons: [],
    units: UnitsModel[],

  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.Image = Image;
    this.CoursePrice = CoursePrice;
    this.Subject = Subject;
    this.Teacher = Teacher;
    this.Exams = Exams;
    this.StageType = StageType;
    this.ExternalLinks = ExternalLinks;
    this.Lives = Lives;
    this.Homeworks = Homeworks;
    this.Sessions = Sessions;
    this.Lessons = Lessons;
    this.units = units;
 
  }


  static fromMap(map: { [key: string]: any }): CourseDetailsModel {
    return new CourseDetailsModel(
      map["id"],
      map["title"],
      map["description"],
      map["image"],
      map["course_price"],
      map["subject"],
      map["teacher"],
      map["exams"],
      map["stage_type"],
      map["external_links"],
      map["lives"],
      map["homeworks"],
      map["sessions"],
      map["lessons"],
      map["units"],
    );
  }
}

