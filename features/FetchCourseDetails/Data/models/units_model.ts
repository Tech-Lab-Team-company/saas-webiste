import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type LessonsModel from "./lessons_model";


export default class UnitsModel {
  public id: number;
  public title: string;
  public lessons: LessonsModel[];
  public isPaid: boolean;




  constructor(
    id: number,
    title: string,
    lessons: LessonsModel[],
    isPaid: boolean,


  ) {
    this.id = id;
    this.title = title;
    this.lessons = lessons;
    this.isPaid = isPaid;
 
  }


  static fromMap(map: { [key: string]: any }): UnitsModel {
    return new UnitsModel(
      map["id"],
      map["title"],
      map["lessons"],
      map["is_paid"],

    );
  }
}



