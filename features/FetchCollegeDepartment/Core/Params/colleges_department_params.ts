import type Params from "~/base/core/Params/params";

export default class CollegeDetpartmentParams implements Params {
  public CollegeId: number;

  constructor(
    CollegeId: number,
    
  ) {
    this.CollegeId = CollegeId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["college_id"] = this.CollegeId;
    return data;
  }
}
