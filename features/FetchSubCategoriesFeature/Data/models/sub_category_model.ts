import SubModel from "./sub_model";

export default class SubCategoryModel {
  public id: number;
  public title: string;
  public sub: SubModel[] = [];

  constructor(id: number, title: string, sub: SubModel[] = []) {
    this.id = id;
    this.title = title;
    this.sub = sub;
  }

  static fromMap(map: { [key: string]: any }): SubCategoryModel {
    return new SubCategoryModel(map["id"],
      map["name"],
      map["sub_categories"]?.map((sub: any) => SubModel.fromMap(sub)));
  }
}
