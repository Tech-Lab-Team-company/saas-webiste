export default class CountryModel {
  public id: number;
  public title: string;

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }

  static fromMap(map: { [key: string]: any }): CountryModel {
    return new CountryModel(map["id"], map["title"]);
  }
}
