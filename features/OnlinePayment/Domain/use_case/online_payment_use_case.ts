import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type OnlinePaymentModel from "../../Data/models/online_payment_model";
import { OnlinePaymentRepo } from "../repositories/online_payment_repo";

export default class OnlinePaymentUseCase
  implements UseCase<OnlinePaymentModel, Params>
{
  async call(params: Params): Promise<DataState<OnlinePaymentModel>> {
    return OnlinePaymentRepo.getInstance().call(params);
  }
}
