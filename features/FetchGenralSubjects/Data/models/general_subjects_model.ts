export default class GeneralSubjectsModel {
  public id: number;
  public title: string;
  public image: string;

  constructor(id: number, title: string, image: string) {
    this.id = id;
    this.title = title;
    this.image = image;

  }

  static fromMap(map: { [key: string]: any }): GeneralSubjectsModel {
    return new GeneralSubjectsModel(
      map["id"],
      map["title"],
      map["image"],
    );
  }
}
