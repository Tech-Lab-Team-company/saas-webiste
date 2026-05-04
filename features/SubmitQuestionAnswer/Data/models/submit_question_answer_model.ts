import type TitleModel from "~/base/core/Models/title_model";
import type QuestionsModel from "./questions_model";

export default class QuestionAnswerModel {
  public id: number;
  public isCorrect: boolean;

  constructor(id: number, isCorrect: boolean) {
    this.id = id;
    this.isCorrect = isCorrect;
  }

  static fromMap(map: { [key: string]: any }): QuestionAnswerModel {
    return new QuestionAnswerModel(map["id"], map["is_correct"]);
  }
}
