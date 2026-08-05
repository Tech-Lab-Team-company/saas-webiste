import ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CrudType } from "~/base/core/Params/call_params_interface";
import type Params from "~/base/core/Params/params";
import { ApiNames } from "~/base/core/networkStructure/apiNames";

export default class FetchMyExamsApiService extends ServicesInterface {
  private static instance: FetchMyExamsApiService;

  private constructor() {
    super();
  }

  static getInstance(): FetchMyExamsApiService {
    if (!this.instance) this.instance = new FetchMyExamsApiService();
    return this.instance;
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.Instance.fetch_my_exams,
      type: CrudType.POST,
      auth: true,
      params,
    });
  }
}
