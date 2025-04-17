import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import {  QuestionAnswerRepo } from "../repositories/submit_question_answer_repo";
// import type UserModel from "../../Data/models/education_stages_model";
import type QuestionAnswerModel from "../../Data/models/submit_question_answer_model";

export default class QuestionAnswerUseCase
  implements UseCase<QuestionAnswerModel, Params>
{
  async call(params: Params): Promise<DataState<QuestionAnswerModel>> {
    return QuestionAnswerRepo.getInstance().call(params);
  }
}
