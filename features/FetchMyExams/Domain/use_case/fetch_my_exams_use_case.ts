import type Params from "~/base/core/Params/params";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type MyExamsResource from "../../Data/models/my_exams_resource";
import FetchMyExamsRepo from "../repositories/fetch_my_exams_repo";

export default class FetchMyExamsUseCase
  implements UseCase<MyExamsResource, Params>
{
  call(params: Params): Promise<DataState<MyExamsResource>> {
    return FetchMyExamsRepo.getInstance().call(params);
  }
}
