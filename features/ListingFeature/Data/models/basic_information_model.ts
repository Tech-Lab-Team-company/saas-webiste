import ImageModel from "~/features/ListingFeature/Data/models/image_model";
import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import CategoryTypeModel from "~/features/FetchCategoryTypeFeature/Data/models/category_type_model";
import UserModel from "~/features/LoginFeature/Data/models/user_model";
import SubCategoryModel from "~/features/FetchSubCategoriesFeature/Data/models/sub_category_model";

export default class BasicInformationModel {
  public id: number;
  public title: string;
  public description: string;
  public image: string;
  public keywords: string;
  public category: CategoryModel[];
  public subCategory: SubCategoryModel[] | null;
  public type: { id: number; name: string };
  public typeCategory: CategoryTypeModel | null;
  public minPrice: number;
  public maxPrice: number;
  public totalRate: number;
  public status: number;
  public rate: number;
  public rateCount: number;
  public claimStatus: number;
  public owner: UserModel | null;
  public isFav: boolean = false

  constructor(
    id: number,
    title: string,
    description: string,
    image: string,
    keywords: string,
    category: CategoryModel[],
    subCategory: SubCategoryModel[] | null,
    type: {
      id: number;
      name: string;
    },
    typeCategory: CategoryTypeModel | null,
    minPrice: number,
    maxPrice: number,
    totalRate: number,
    status: number,
    rate: number,
    rateCount: number,
    claimStatus: number,
    owner: UserModel | null,
    isFav: boolean
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.keywords = keywords;
    this.category = category;
    this.subCategory = subCategory;
    this.type = type;
    this.typeCategory = typeCategory;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.totalRate = totalRate;
    this.status = status;
    this.rate = rate;
    this.rateCount = rateCount;
    this.claimStatus = claimStatus;
    this.owner = owner;
    this.isFav = isFav
  }

  static fromMap(map: { [key: string]: any }): BasicInformationModel {
    return new BasicInformationModel(
      map["id"],
      map["title"],
      map["description"],
      map["image"],
      map["keywords"],
      map["categories"]?.map((category: any) => CategoryModel.fromMap(category)) ?? [],
      map["sub_categories"]
        ? map["sub_categories"].map((subCategory: any) => SubCategoryModel.fromMap(subCategory))
        : null,
      map["type"],
      map["type_category"]
        ? CategoryTypeModel.fromMap(map["type_category"])
        : null,
      map["min_price"],
      map["max_price"],
      map["total_rate"],
      map["status"],
      map["rate"],
      map["total_rate"],
      map["claim_status"],
      map["owner"] ? UserModel.fromMap(map["owner"]) : null,
        map["is_bookmarked"]
    );
  }
}
