import type Params from "~/base/core/Params/params";

export default class EducationBasicSubjectsParams implements Params {
  public CategoryId: number;
  public YearId: number;

  constructor(
    CategoryId: number,
    YearId: number,
    
  ) {
    this.CategoryId = CategoryId;
    this.YearId = YearId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["category_id"] = this.CategoryId;
    data["year_id"] = this.YearId;
    return data;
  }
}
