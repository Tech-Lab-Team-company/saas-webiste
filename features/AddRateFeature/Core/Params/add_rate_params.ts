import type Params from "~/base/core/Params/params";

export default class AddRateParams implements Params {
  public listingId: string;
  public rateMoney: number;
  public rateLocation: number;
  public rateCleanLines: number;
  public rateService: number;
  public notes: string | null;
  public images: string[];

  constructor(
    listingId: string,
    rateMoney: number,
    rateLocation: number,
    rateCleanLines: number,
    rateService: number,
    notes: string | null,
    images: string[],
  ) {
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
