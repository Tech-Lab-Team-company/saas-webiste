import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type SessionsModel from "./sessions_model";


export default class LessonsModel {
  public id: number;
  public title: string;
  public text: string;
  public about: string;
  public duration: number;
  public CourseId: number;
  public image: string;
  public isPaid: boolean;
  public Sessions: SessionsModel[];




  constructor(
    id: number,
    title: string,
    text: string,
    about: string,
    duration: number,
    CourseId: number,
    image: string,
    isPaid: boolean,
    Sessions: SessionsModel[],


  ) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.about = about;
    this.duration = duration;
    this.CourseId = CourseId;
    this.image = image;
    this.isPaid = isPaid;
    this.Sessions = Sessions;
 
  }


  static fromMap(map: { [key: string]: any }): LessonsModel {
    return new LessonsModel(
      map["id"],
      map["title"],
      map["text"],
      map["about"],
      map["duration"],
      map["course_id"],
      map["image"],
      map["is_paid"],
      map["sessions"],

    );
  }
}



            
             
                 
        
                     
                      
                