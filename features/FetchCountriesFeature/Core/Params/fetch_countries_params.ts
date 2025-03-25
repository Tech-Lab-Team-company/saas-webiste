import type Params from "~/base/core/Params/params";

export default class FetchCountriesParams implements Params {
  public page?: number;
  public limit?: number;

  constructor(page?: number, limit?: number) {
    this.page = page;
    this.limit = limit;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
