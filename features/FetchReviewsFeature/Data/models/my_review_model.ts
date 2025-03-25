import ImageModel from "~/features/ListingFeature/Data/models/image_model";

export default class MyReviewModel {
  public id: number;
  public listing: {
    id: number;
    name: string;
    slug: string;
  };
  public rate: number;
  public comment: string;
  public createdAt: string;
  public images: ImageModel[];
  public rateMoney: number;
  public rateLocation: number;
  public rateCleanLines: number;
  public rateService: number;

  constructor(
    id: number,
    listing: {
      id: number;
      name: string;
      slug: string;
    },
    rate: number,
    comment: string,
    createdAt: string,
    images: ImageModel[],
    rateMoney: number,
    rateLocation: number,
    rateCleanLines: number,
    rateService: number,
    
  ) {
    this.id = id;
    this.listing = listing;
    this.rate = rate;
    this.comment = comment;
    this.createdAt = createdAt;
    this.images = images;
    this.rateMoney = rateMoney;
    this.rateLocation = rateLocation;
    this.rateCleanLines = rateCleanLines;
    this.rateService = rateService;
  }

  static fromMap(map: { [key: string]: any }): MyReviewModel {
    return new MyReviewModel(
      map["id"],
      map["listing"],
      map["rating"],
      map["comment"],
      map["createdAt"],
      map["images"]?.map((image: any) => ImageModel.fromMap(image)) ?? [],
      map["value_for_money_rate"],
      map["location_rate"],
      map["clean_lines_rate"],
      map["service_rate"],
    );
  }
}
