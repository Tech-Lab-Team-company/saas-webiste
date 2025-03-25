import type Params from "~/base/core/Params/params";

export default class FetchSubCategoriesParams implements Params {
  public categoryId: number[];
  public page?: number;
  public limit?: number;

  constructor(categoryId: number[], page?: number, limit?: number) {
    this.page = page;
    this.categoryId = categoryId;
    this.limit = limit;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["category_ids"] = this.categoryId;
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
