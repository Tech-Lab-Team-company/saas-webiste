import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import {  SubmitEducationDataRepo } from "../repositories/submit_education_data_repo";
// import type UserModel from "../../Data/models/education_stages_model";
import type TitleModel from "~/base/core/Models/title_model";
import type UserModel from "../../Data/models/submit_education_data_model";

export default class SubmitEducationDataUseCase
  implements UseCase<UserModel, Params>
{
  async call(params: Params): Promise<DataState<UserModel>> {
    return SubmitEducationDataRepo.getInstance().call(params);
  }
}
