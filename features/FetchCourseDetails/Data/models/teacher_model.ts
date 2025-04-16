import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type ImageModel from "./image_model";

export default class TeacherModel {
  public id: number;
  public name: string;
  public image: ImageModel;



  constructor(
    id: number,
    name: string,
    image: ImageModel,


  ) {
    this.id = id;
    this.name = name;
    this.image = image;
 
  }


  static fromMap(map: { [key: string]: any }): TeacherModel {
    return new TeacherModel(
      map["id"],
      map["name"],
      map["image"],

    );
  }
}


