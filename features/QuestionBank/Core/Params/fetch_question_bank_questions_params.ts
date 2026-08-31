import type Params from "~/base/core/Params/params";

export default class FetchQuestionBankQuestionsParams implements Params {
  constructor(public readonly questionBankId: number) {}

  toMap(): { question_bank_id: number } {
    return { question_bank_id: this.questionBankId };
  }
}
