import type Params from "~/base/core/Params/params";

export default class CollegesParams implements Params {
  public UnviversityId: number;

  constructor(
    UnviversityId: number,
    
  ) {
    this.UnviversityId = UnviversityId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["university_id"] = this.UnviversityId;
    return data;
  }
}
