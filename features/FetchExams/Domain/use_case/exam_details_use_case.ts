import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import {  ExamDetailsRepo } from "../repositories/exam_details_repo";
// import type UserModel from "../../Data/models/education_stages_model";
import type ExamDetailsModel from "../../Data/models/exam_details_model";

export default class ExamDetailsUseCase
  implements UseCase<ExamDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ExamDetailsModel>> {
    return ExamDetailsRepo.getInstance().call(params);
  }
}
