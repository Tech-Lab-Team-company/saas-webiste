import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type PurchasesModel from "../../Data/models/purchases_model";
import FetchPurchasesRepo from "../repositories/fetch_purchases_repo";

export default class FetchPurchasesUseCase
  implements UseCase<PurchasesModel, Params>
{
  async call(params: Params): Promise<DataState<PurchasesModel>> {
    return FetchPurchasesRepo.getInstance().call(params);
  }
}
