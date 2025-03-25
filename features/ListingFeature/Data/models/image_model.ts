export default class ImageModel {
  public id: number;
  public image: string;

  constructor(id: number, image: string) {
    this.id = id;
    this.image = image;
  }

  static fromMap(map: { [key: string]: any }): ImageModel {
    return new ImageModel(map["id"], map["image"]);
  }
}
