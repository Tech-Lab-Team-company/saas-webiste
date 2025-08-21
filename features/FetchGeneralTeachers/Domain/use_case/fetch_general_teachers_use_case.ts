import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import {  FetchGeneralTeachersRepo } from "../repositories/fetch_general_teachers_repo";
import type GeneralTeachersModel from "../../Data/models/general_teachers_model";

export default class FetchGeneralTeachersUseCase
  implements UseCase<GeneralTeachersModel[], Params>
{
  async call(params: Params): Promise<DataState<GeneralTeachersModel[]>> {
    return FetchGeneralTeachersRepo.getInstance().call(params);
  }
}
