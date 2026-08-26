import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type UserModel from "../../Data/models/online_statue_model";
import { ChangeOnlineStatusRepo } from "../repositories/change_online_statue_repo";

export default class ChangeOnlineStatusUseCase
  implements UseCase<UserModel, Params>
{
  async call(params: Params): Promise<DataState<UserModel>> {
    return ChangeOnlineStatusRepo.getInstance().call(params);
  }
}
