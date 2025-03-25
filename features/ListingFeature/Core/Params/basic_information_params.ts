import type Params from "~/base/core/Params/params";
import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import CategoryTypeModel from "~/features/FetchCategoryTypeFeature/Data/models/category_type_model";
import { convertToBase64 } from "~/base/persention/utils/convert_to_base_64";
import type SubCategoryModel from "~/features/FetchSubCategoriesFeature/Data/models/sub_category_model";

export default class BasicInformationParams implements Params {
  public title: string;
  public logo: string | null;
  public categories: CategoryModel[];
  public subCategories: SubCategoryModel[];
  public serviceCategory: CategoryTypeModel;
  public keywords: string;
  public description: string;
  public minimumPriceRange: number;
  public maximumPriceRange: number;
  public type: number = 1;

  constructor(
    title: string,
    logo: string | null,
    categories: CategoryModel[],
    subCategories: SubCategoryModel[],
    serviceCategory: CategoryTypeModel,
    keywords: string,
    description: string,
    minimumPriceRange: number,
    maximumPriceRange: number,
    type: number = 1,
  ) {
    this.title = title;
    this.logo = logo;
    this.categories = categories;
    this.subCategories = subCategories;
    this.serviceCategory = serviceCategory;
    this.keywords = keywords;
    this.description = description;
    this.minimumPriceRange = minimumPriceRange;
    this.maximumPriceRange = maximumPriceRange;
    this.type = type;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["title"] = this.title;
    data["image"] = this.logo;
    data["category_ids"] = this.categories.map((category) => category.id);
    data["sub_category_ids"] = this.subCategories.map((subCategory) => subCategory.id);
    data["type_category_id"] = this.serviceCategory.id;
    data["keywords"] = this.keywords;
    data["description"] = this.description;
    data["minimum_price"] = this.minimumPriceRange;
    data["maximum_price"] = this.maximumPriceRange;
    data["service_id"] = this.type ?? 1;
    return data;
  }
}
