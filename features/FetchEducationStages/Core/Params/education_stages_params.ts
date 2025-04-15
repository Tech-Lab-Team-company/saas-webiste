import type Params from "~/base/core/Params/params";

export default class EducationStagesParams implements Params {
  public CategoryId: number;

  constructor(
    CategoryId: number,
    
  ) {
    this.CategoryId = CategoryId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["category_id"] = this.CategoryId;
    return data;
  }
}
