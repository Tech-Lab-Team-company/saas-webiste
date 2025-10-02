import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type VerifyPaymentModel from "../../Data/models/verify_payment_model";
import { VerifyPaymentRepo } from "../repositories/verify_payment_repo";

export default class VerifyPaymentUseCase
  implements UseCase<VerifyPaymentModel, Params>
{
  async call(params: Params): Promise<DataState<VerifyPaymentModel>> {
    return VerifyPaymentRepo.getInstance().call(params);
  }
}
