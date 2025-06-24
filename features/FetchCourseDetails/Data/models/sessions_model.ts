import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type LessonsModel from "./lessons_model";


export default class SessionsModel {
  public id: number;
  public LessonId: number;
  public title: string;
  public text: string;
  public type: number;
  public link: string;
  public isPaid: boolean;
  public exam: string;
  public hasExam: boolean;
  public StratDate: string;
  public EndDate: string;
  public Secure: number;





  constructor(
    id: number,
    LessonId: number,
    title: string,
    text: string,
    type: number,
    link: string,
    isPaid: boolean,
    exam: string,
    hasExam: boolean,
    StratDate: string,
    EndDate: string,
    Secure: number,


  ) {
    this.id = id;
    this.LessonId = LessonId;
    this.title = title;
    this.text = text;
    this.type = type;
    this.link = link;
    this.isPaid = isPaid;
    this.exam = exam;
    this.hasExam = hasExam;
    this.StratDate = StratDate;
    this.EndDate = EndDate;
    this.Secure = Secure;
    
 
  }


  static fromMap(map: { [key: string]: any }): SessionsModel {
    return new SessionsModel(
      map["id"],
      map["lesson_id"],
      map["title"],
      map["text"],
      map["type"],
      map["link"],
      map["is_paid"],
      map["exam"],
      map["has_exam"],
      map["start_date"],
      map["end_date"],
      map["secure"],
    );
  }
}



      



