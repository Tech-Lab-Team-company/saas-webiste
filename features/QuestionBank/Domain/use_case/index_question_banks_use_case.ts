import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type QuestionBankModel from "../../Data/models/question_banks_model";
import { QuestionBankRepo } from "../repositories/index_question_banks_repo";

export default class QuestionBankUseCase
  implements UseCase<QuestionBankModel[], Params> {
  async call(params: Params): Promise<DataState<QuestionBankModel[]>> {
    return QuestionBankRepo.getInstance().call(params);
  }
}
