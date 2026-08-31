import type Params from "~/base/core/Params/params";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type QuestionBankContentModel from "../../Data/models/question_bank_content_model";
import FetchQuestionBankQuestionsRepo from "../repositories/fetch_question_bank_questions_repo";

export default class FetchQuestionBankQuestionsUseCase
  implements UseCase<QuestionBankContentModel, Params>
{
  async call(params: Params): Promise<DataState<QuestionBankContentModel>> {
    return FetchQuestionBankQuestionsRepo.getInstance().call(params);
  }
}
