import type Params from "~/base/core/Params/params";

export default class FetchOtherReviewParams implements Params {
  public is_other: boolean;
  public lat: number;
  public lng: number;
  public page?: number;
  public limit?: number;

  constructor(is_other: boolean = false, lat: number, lng: number, page?: number, limit?: number) {
    this.is_other = is_other;
    this.page = page;
    this.lat = lat;
    this.lng = lng;
    this.limit = limit;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["is_other"] = this.is_other ? 1 : 0;
    data["lat"] = this.lat;
    data["lng"] = this.lng;
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
