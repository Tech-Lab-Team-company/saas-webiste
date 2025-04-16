import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";

export default class ImageModel {
  public image: string;
  public alt: string; // Use 'string' instead of 'String'


  constructor(
    image: string,
    alt: string,

  ) {
    this.image = image;
    this.alt = alt;
 
  }


  static fromMap(map: { [key: string]: any }): ImageModel {
    return new ImageModel(
      map["image"],
      map["alt"],
    );
  }
}



