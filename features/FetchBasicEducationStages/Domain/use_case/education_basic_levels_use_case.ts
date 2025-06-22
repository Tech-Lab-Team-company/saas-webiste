import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { EducationBasicLevelsRepo } from "../repositories/education_basic_levels_repo";
import type TitleModel from "~/base/core/Models/title_model";

export default class EducationBasicLevelsUseCase
  implements UseCase<TitleModel[], Params>
{
  async call(params: Params): Promise<DataState<TitleModel[]>> {
    return EducationBasicLevelsRepo.getInstance().call(params);
  }
}
