import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";

export default class BookmarkModel {
  public id: number;
  public name: string;
  public image: string;
  public description: string;
  public address: string;
  public views: string;
  public status: number;
  public category: CategoryModel[];
  public rate: number;
  public reviewCount: number;
  public isFav: boolean;

  constructor(
    id: number,
    name: string,
    image: string,
    description: string,
    address: string,
    views: string,
    status: number,
    category: CategoryModel[],
    rate: number,
    reviewCount: number,
    isFav: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.address = address;
    this.views = views;
    this.status = status;
    this.category = category;
    this.rate = rate;
    this.reviewCount = reviewCount;
    this.isFav = isFav;
  }

  static fromMap(map: { [key: string]: any }): BookmarkModel {
    return new BookmarkModel(
      map["id"],
      map["title"],
      map["image"],
      map["description"],
      map["address"],
      map["views"],
      map["status"],
      map["categories"]?.map((category: any) => CategoryModel.fromMap(category)),
      map["rate"],
      map["reviews_count"],
      map["is_bookmark"],
    );
  }
}
