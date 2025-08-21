import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchGeneralSubjectsRepo } from "../repositories/fetch_general_subjects_repo";
import type GeneralSubjectsModel from "../../Data/models/general_subjects_model";

export default class FetchGeneralSubjectsUseCase
  implements UseCase<GeneralSubjectsModel[], Params>
{
  async call(params: Params): Promise<DataState<GeneralSubjectsModel[]>> {
    return FetchGeneralSubjectsRepo.getInstance().call(params);
  }
}
