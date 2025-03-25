import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";

export default class ListingModel {
  public id: number;
  public name: string;
  public image: string;
  public description: string;
  public address: string;
  public views: string;
  public isFav: boolean;
  public rate: number;
  public rateCount: number;
  public status: number;
  public lat: number;
  public lng: number;
  public category: CategoryModel;
  public reviewsCount: number;
  public isSponsored: number;
  public slug: string;


  constructor(
    id: number,
    name: string,
    image: string,
    description: string,
    address: string,
    views: string,
    isFav: boolean,
    status: number,
    rate: number,
    rateCount: number,
    lat: number,
    lng: number,
    category: CategoryModel,
    reviewsCount: number,
    isSponsored: number,
    slug: string
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.address = address;
    this.views = views;
    this.isFav = isFav;
    this.status = status;
    this.rate = rate;
    this.rateCount = rateCount;
    this.lat = lat;
    this.lng = lng;
    this.category = category;
    this.reviewsCount = reviewsCount;
    this.isSponsored = isSponsored;
    this.slug = slug;
  }

  static fromMap(map: { [key: string]: any }): ListingModel {
    // console.log(map,"map");
    return new ListingModel(
      map["id"],
      map["title"],
      map["image"],
      map["description"],
      map["address"],
      map["views"],
      map["is_bookmark"],
      map["status"],
      map["rate"],
      map["rate_count"],
      map["lat"],
      map["lng"],
      map["categories"]?.map((item) => CategoryModel.fromMap(item)),
      map["reviews_count"],
      map["is_sponsored"],
      map["slug"]
    );
  }
}
