import type Params from "~/base/core/Params/params";

export default class SearchListingParams implements Params {
  keyword: string;
  lat: number;
  lng: number;
  page: number;
  limit: number;
  constructor(keyword: string,lat:number,lng:number, page: number, limit: number) {
    this.keyword = keyword;
    this.lat = lat;
    this.lng = lng;
    this.page = page;
    this.limit = limit;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["keyword"] = this.keyword;
    data["lat"] = this.lat;
    data["lng"] = this.lng;
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}