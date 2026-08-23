import ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CrudType } from "~/base/core/Params/call_params_interface";
import type Params from "~/base/core/Params/params";
import { ApiNames } from "~/base/core/networkStructure/apiNames";

export default class FetchPurchasesApiService extends ServicesInterface {
  private static instance: FetchPurchasesApiService;

  private constructor() {
    super();
  }

  static getInstance(): FetchPurchasesApiService {
    if (!this.instance) this.instance = new FetchPurchasesApiService();
    return this.instance;
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.Instance.fetch_my_purchased,
      type: CrudType.POST,
      auth: true,
      params,
    });
  }
}
