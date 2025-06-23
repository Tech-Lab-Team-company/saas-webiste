import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type ImageModel from "./image_model";
import type TitleModel from "~/base/core/Models/title_model";
import type TeacherModel from "./teacher_model";
import type UnitsModel from "./units_model";
import type examsModel from "./exams_model";
import type HomeWorkModel from "./homework_model";

export default class CourseDetailsModel {
  public id: number;
  public title: string; // Use 'string' instead of 'String'
  public description: string; 
  public Image: ImageModel; 
  public CoursePrice: number; 
  public Subject:TitleModel;
  public Teacher:TeacherModel;
  public exams:examsModel[];
  public StageType:number;
  public externalLinks: [];
  public lives: [];
  public homeworks: HomeWorkModel[];
  public sessions: [];
  public lessons: [];
  public units: UnitsModel[];
  public allow_status: number;
  public currency: string;



  constructor(
    id: number,
    title: string,
    description: string,
    Image: ImageModel,
    CoursePrice: number,
    Subject: TitleModel,
    Teacher: TeacherModel,
    exams: examsModel[],
    StageType: number,
    externalLinks: [],
    lives: [],
    homeworks: HomeWorkModel[],
    sessions: [],
    lessons: [],
    units: UnitsModel[],
    allow_status: number,
    currency: string,

  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.Image = Image;
    this.CoursePrice = CoursePrice;
    this.Subject = Subject;
    this.Teacher = Teacher;
    this.exams = exams;
    this.StageType = StageType;
    this.externalLinks = externalLinks;
    this.lives = lives;
    this.homeworks = homeworks;
    this.sessions = sessions;
    this.lessons = lessons;
    this.units = units;
    this.allow_status = allow_status;
    this.currency = currency;
 
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
      map["allow_status"],
      map["currency"],
    );
  }
}

