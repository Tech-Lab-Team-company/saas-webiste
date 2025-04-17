import type Params from "~/base/core/Params/params";

export default class QuestionAnswerParams implements Params {
  public ExamId: number;
  public QuestionId: number;
  public AnswerId: number;

  constructor(
    ExamId: number,
    QuestionId: number,
    AnswerId: number,
    
  ) {
    this.ExamId = ExamId;
    this.QuestionId = QuestionId;
    this.AnswerId = AnswerId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["exam_id"] = this.ExamId;
    data["question_id"] = this.QuestionId;
    data["answer_id"] = this.AnswerId;
    return data;
  }
}
