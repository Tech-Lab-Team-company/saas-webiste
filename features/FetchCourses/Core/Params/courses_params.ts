import type Params from "~/base/core/Params/params";

export default class CoursesParams implements Params {
  public id: string;

  constructor(
    id: string,  
  ) {
    this.id = id;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["id"] = this.id;
    return data;
  }
}
