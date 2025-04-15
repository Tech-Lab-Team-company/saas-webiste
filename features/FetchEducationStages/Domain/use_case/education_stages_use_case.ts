import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { EducationStagesRepo } from "../repositories/education_stages_repo";
// import type UserModel from "../../Data/models/education_stages_model";
import type TitleModel from "~/base/core/Models/title_model";

export default class EducationStagesUseCase
  implements UseCase<TitleModel[], Params>
{
  async call(params: Params): Promise<DataState<TitleModel[]>> {
    return EducationStagesRepo.getInstance().call(params);
  }
}
