import type Params from "~/base/core/Params/params";

export default class FetchMyReviewParams implements Params {
  public lat: number;
  public lng: number;
  public page?: number;
  public limit?: number;

  constructor(lat: number, lng: number, page?: number, limit?: number) {
    this.page = page;
    this.limit = limit;
    this.lat = lat;
    this.lng = lng;
  }

  /**
   * Converts the instance properties to a map representation.
   * @returns {Object} A map containing 'lat', 'lng', 'page', and 'limit' keys with their corresponding values.
   */

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["lat"] = this.lat?.toString();
    data["lng"] = this.lng?.toString();
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
