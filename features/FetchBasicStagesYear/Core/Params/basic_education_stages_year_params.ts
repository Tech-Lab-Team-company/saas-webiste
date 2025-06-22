import type Params from "~/base/core/Params/params";

export default class EducationBasicStagesYearParams implements Params {
  public EducationStageId: number;

  constructor(
    EducationStageId: number,
    
  ) {
    this.EducationStageId = EducationStageId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["stage_id"] = this.EducationStageId;
    return data;
  }
}
