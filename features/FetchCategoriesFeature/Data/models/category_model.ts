import SubModel from "~/features/FetchSubCategoriesFeature/Data/models/sub_model";

export default class CategoryModel {
  public id: number;
  public title: string;
  public image: string;
  public subCategory: SubModel[] = [];

  constructor(id: number, title: string, image: string, SubModel: SubModel[] = []) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.subCategory = SubModel;
  }

  static fromMap(map: { [key: string]: any }): CategoryModel {
    return new CategoryModel(map["id"], map["name"], map["image"], map["sub_categories"]?.map((sub: any) => SubModel.fromMap(sub)));
  }
}
