import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type AddFavoriteParams from "../../Core/Params/add_favorite_params";
import { AddFavoriteRepo } from "../repositories/add_favorite_repo";

export default class AddFavoriteUseCase
  implements UseCase<void, AddFavoriteParams>
{
  async call(params: AddFavoriteParams): Promise<DataState<void>> {
    return AddFavoriteRepo.getInstance().call(params);
  }
}
