import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";

export default class TitleModel {
  public id: number;
  public title: string; // Use 'string' instead of 'String'


  constructor(
    id: number,
    title: string,

  ) {
    this.id = id;
    this.title = title;
 
  }


  static fromMap(map: { [key: string]: any }): TitleModel {
    return new TitleModel(
      map["id"],
      map["title"],
    );
  }
}



