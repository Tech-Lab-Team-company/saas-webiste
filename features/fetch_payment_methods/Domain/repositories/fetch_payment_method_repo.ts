import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import {FetchPaymentMethodApiService, } from "../../Data/api_services/fetch_payment_method_api_services";
import PaymentMethodModel from "../../Data/models/fetch_payment_method_model";

class FetchPaymentMethodRepo extends RepoInterface<PaymentMethodModel[]> {
  private static instance: FetchPaymentMethodRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchPaymentMethodRepo();
    }
    return this.instance;
  }


  onParse(data: any): PaymentMethodModel[] {
    return data.map((item: any) => PaymentMethodModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchPaymentMethodApiService.getInstance();
  }
}

export { FetchPaymentMethodRepo };
