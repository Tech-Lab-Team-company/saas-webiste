import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type Params from "~/base/core/Params/params";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type QuestionBankContentModel from "../../Data/models/question_bank_content_model";
import FetchQuestionBankQuestionsUseCase from "../../Domain/use_case/fetch_question_bank_questions_use_case";

export default class FetchQuestionBankQuestionsController extends ControllerInterface<QuestionBankContentModel> {
  private static instance: FetchQuestionBankQuestionsController;
  private readonly useCase = new FetchQuestionBankQuestionsUseCase();

  private constructor() {
    super();
  }

  static getInstance(): FetchQuestionBankQuestionsController {
    if (!this.instance) {
      this.instance = new FetchQuestionBankQuestionsController();
    }
    return this.instance;
  }

  async fetchQuestionBankQuestions(params: Params) {
    this.setLoading();
    const dataState: DataState<QuestionBankContentModel> =
      await this.useCase.call(params);
    this.setState(dataState);
    return this.state;
  }
}
