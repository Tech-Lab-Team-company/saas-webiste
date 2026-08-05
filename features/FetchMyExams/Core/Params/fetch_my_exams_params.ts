import type Params from "~/base/core/Params/params";

export default class FetchMyExamsParams implements Params {
  constructor(public courseId: number | string | null = null) {}

  toMap(): { [key: string]: any } {
    if (this.courseId === null || this.courseId === "") return {};

    return { course_id: Number(this.courseId) };
  }
}
