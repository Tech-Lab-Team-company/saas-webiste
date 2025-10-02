import { ApiNames } from "~/base/core/networkStructure/apiNames";
import ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CrudType } from "~/base/core/Params/call_params_interface";
import type Params from "~/base/core/Params/params";

class OnlinePaymentApiService extends ServicesInterface {
  private static instance: OnlinePaymentApiService;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new OnlinePaymentApiService();
    }
    return this.instance;
  }

  async applyService(
    params: Params
  ): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.Instance.CreateOnlinePayment,
      type: CrudType.POST,
      auth: true,
      params: params,
      showLoadingDialog: true,
    });
  }
}

export { OnlinePaymentApiService };
