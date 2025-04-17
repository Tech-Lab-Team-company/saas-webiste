import type Params from "~/base/core/Params/params";

export default class ExamDetailsParams implements Params {
  public ExamId: string;

  constructor(
    ExamId: string,
    
  ) {
    this.ExamId = ExamId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["exam_id"] = this.ExamId;
    return data;
  }
}
