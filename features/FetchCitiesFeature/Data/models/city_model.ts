export default class CityModel {
  public id: number;
  public title: string;

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }

  static fromMap(map: { [key: string]: any }): CityModel {
    return new CityModel(map["id"], map["title"]);
  }
}
