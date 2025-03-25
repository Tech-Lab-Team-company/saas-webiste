import ImageModel from "~/features/ListingFeature/Data/models/image_model";

export default class ReviewModel {
  public id: number;
  public clientName: string;
  public clientImage: string;
  public rate: number;
  public createdAt: string;
  public comment: string;
  public images: ImageModel[];
  public upVotes: number;
  public downVotes: number;
  public isUpVoted: boolean;
  public isDownVoted: boolean;
  public listing: { id: number; name: string };
  public rateMoney: number;
  public rateLocation: number;
  public rateCleanLines: number;
  public rateService: number;


  constructor(
    id: number,
    clientName: string,
    clientImage: string,
    rate: number,
    createdAt: string,
    comment: string,
    images: ImageModel[],
    upVotes: number = 0,
    downVotes: number = 0,
    isUpVoted: boolean = false,
    isDownVoted: boolean = false,
    listing: { id: number; name: string },
    rateMoney: number,
    rateLocation: number,
    rateCleanLines: number,
    rateService: number,
  ) {
    this.id = id;
    this.clientName = clientName;
    this.clientImage = clientImage;
    this.rate = rate;
    this.createdAt = createdAt;
    this.comment = comment;
    this.images = images;
    this.upVotes = upVotes;
    this.downVotes = downVotes;
    this.isUpVoted = isUpVoted;
    this.isDownVoted = isDownVoted;
    this.listing = listing;
    this.rateMoney = rateMoney;
    this.rateLocation = rateLocation;
    this.rateCleanLines = rateCleanLines;
    this.rateService = rateService;
  }

  static fromMap(map: { [key: string]: any }): ReviewModel {
    return new ReviewModel(
      map["id"],
      map["client_name"],
      map["client_image"],
      map["rating"],
      map["created_at"],
      map["comment"],
      map["images"]?.map((image: any) => ImageModel.fromMap(image)) ?? [],
      map["up_votes"],
      map["down_votes"],
      map["is_upvoted"],
      map["is_downvoted"],
      map["listing"],
      map["value_for_money_rate"],
      map["location_rate"],
      map["clean_lines_rate"],
      map["service_rate"],
    );
  }
}
