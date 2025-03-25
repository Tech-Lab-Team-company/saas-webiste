import type Params from "~/base/core/Params/params";

export default class EditRateParams implements Params {
  public rateId: number;
  public listingId: string;
  public rateMoney: number;
  public rateLocation: number;
  public rateCleanLines: number;
  public rateService: number;
  public notes: string | null;
  public images: string[];

  constructor(
    rateId: number,
    listingId: string,
    rateMoney: number,
    rateLocation: number,
    rateCleanLines: number,
    rateService: number,
    notes: string | null,
    images: string[],
  ) {
    this.rateId = rateId;
    this.listingId = listingId;
    this.rateMoney = rateMoney;
    this.rateLocation = rateLocation;
    this.rateCleanLines = rateCleanLines;
    this.rateService = rateService;
    this.notes = notes;
    this.images = images;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["review_id"] = this.rateId;
    data["listing_id"] = this.listingId;
    data["value_for_money_rate"] = this.rateMoney;
    data["location_rate"] = this.rateLocation;
    data["clean_lines_rate"] = this.rateCleanLines;
    data["service_rate"] = this.rateService;
    data["comment"] = this.notes;
    data["images"] = this.images;
    return data;
  }
}
