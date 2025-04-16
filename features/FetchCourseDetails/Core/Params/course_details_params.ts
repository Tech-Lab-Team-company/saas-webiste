import type Params from "~/base/core/Params/params";

export default class CourseDetailsParams implements Params {
  public CourseId: string;

  constructor(
    CourseId: string,
    
  ) {
    this.CourseId = CourseId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["course_id"] = this.CourseId;
    return data;
  }
}
