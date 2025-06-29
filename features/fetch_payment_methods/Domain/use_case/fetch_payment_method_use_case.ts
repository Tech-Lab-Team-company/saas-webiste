import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import {   FetchPaymentMethodRepo } from "../repositories/fetch_payment_method_repo";
import type PaymentMethodModel from "../../Data/models/fetch_payment_method_model";

export default class FetchPaymentMethodUseCase
  implements UseCase<PaymentMethodModel[], Params>
{
  async call(params: Params): Promise<DataState<PaymentMethodModel[]>> {
    return FetchPaymentMethodRepo.getInstance().call(params);
  }
}
