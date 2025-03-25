import type Params from "~/base/core/Params/params";

export default class FetchBookmarkParams implements Params {
  public lat: number;
  public lng: number;
  public page?: number;
  public limit?: number;

  constructor(lat: number, lng: number, page?: number, limit?: number) {
    this.lat = lat;
    this.lng = lng;
    this.page = page;
    this.limit = limit;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["lat"] = this.lat.toString();
    data["lng"] = this.lng.toString();
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
