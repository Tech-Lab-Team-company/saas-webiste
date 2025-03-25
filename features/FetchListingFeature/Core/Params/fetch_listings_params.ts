import type Params from "~/base/core/Params/params";

export default class FetchListingParams implements Params {
  public status: number;
  public lat?: number;
  public lng?: number;
  public query?: string;
  public page?: number;
  public limit?: number;

  constructor(status: number, lat: number, lng: number, query?: string, page?: number, limit?: number) {
    this.status = status;
    this.lat = lat;
    this.lng = lng;
    this.query = query;
    this.page = page;
    this.limit = limit;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["status"] = this.status;
    data["lat"] = this.lat?.toString();
    data["lng"] = this.lng?.toString();
    data["query"] = this.query;
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
