import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";

export default class UserModel {
  public id: number;
  public title: string; // Use 'string' instead of 'String'


  constructor(
    id: number,
    title: string,

  ) {
    this.id = id;
    this.title = title;
 
  }


  static fromMap(map: { [key: string]: any }): UserModel {
    return new UserModel(
      map["id"],
      map["title"],
    );
  }
}



