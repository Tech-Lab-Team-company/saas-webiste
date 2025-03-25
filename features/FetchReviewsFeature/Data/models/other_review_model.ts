import ImageModel from "~/features/ListingFeature/Data/models/image_model";

export default class OtherReviewModel {
  public id: number;
  public clientName: string
  public clientImage: string

  public listing: {
    id: number;
    name: string;
    slug: string;
  };
  public rating: number;
  public comment: string;
  public createdAt: string;
  public images: ImageModel[]


  constructor(
    id: number,
    clientName: string,
    clientImage: string,
    listing: { id: number; name: string, slug: string },
    rating: number,
    comment: string,
    createdAt: string,
    images: ImageModel[],

  ) {
    this.id = id;
    this.listing = listing;
    this.clientName = clientName;
    this.clientImage = clientImage;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
    this.images= images;

  }

  static fromMap(map: { [key: string]: any }): OtherReviewModel {
    return new OtherReviewModel(
      map["id"],
      map["client_name"],
      map["client_image"],
      map["listing"],
      map["rating"],
      map["comment"],
      map["createdAt"],
      map["images"],
    );
  }
}
