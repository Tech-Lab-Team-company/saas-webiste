import ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import type Params from "~/base/core/Params/params";
import { CrudType } from "~/base/core/Params/call_params_interface";
import { ApiNames } from "~/base/core/networkStructure/apiNames";

class ScanCodeApiService extends ServicesInterface {
  private static instance: ScanCodeApiService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) this.instance = new ScanCodeApiService();
    return this.instance;
  }

  async applyService(
    params: Params,
  ): Promise<{ data: unknown; statusCode: number }> {
    return await super.call({
      url: ApiNames.Instance.buy_product,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: false,
    });
  }
}

export { ScanCodeApiService };
