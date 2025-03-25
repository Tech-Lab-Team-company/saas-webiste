import type Params from "~/base/core/Params/params";

export default class FetchCategoryTypesParams implements Params {
  public serviceTypeId: number;
  public page?: number;
  public limit?: number;

  constructor(serviceTypeId: number, page?: number, limit?: number) {
    this.page = page;
    this.serviceTypeId = serviceTypeId;
    this.limit = limit;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["service_id"] = this.serviceTypeId;
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
