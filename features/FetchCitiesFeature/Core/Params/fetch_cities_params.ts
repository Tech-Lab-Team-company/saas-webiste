import type Params from "~/base/core/Params/params";

export default class FetchCitiesParams implements Params {
  public countryId: number;
  public page?: number;
  public limit?: number;

  constructor(countryId: number,page?: number, limit?: number) {
    this.page = page;
    this.countryId = countryId;
    this.limit = limit;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["country_id"] = this.countryId;
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
