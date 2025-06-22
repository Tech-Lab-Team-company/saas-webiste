import type Params from "~/base/core/Params/params";

export default class EducationBasicLevelsParams implements Params {
  public EducationLevelId: number;

  constructor(
    EducationLevelId: number,
    
  ) {
    this.EducationLevelId = EducationLevelId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["education_type_id"] = this.EducationLevelId;
    return data;
  }
}
