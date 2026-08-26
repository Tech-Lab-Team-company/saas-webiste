import ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CrudType } from "~/base/core/Params/call_params_interface";
import type Params from "~/base/core/Params/params";
import { ApiNames } from "~/base/core/networkStructure/apiNames";

export default class FetchMyLibraryBooksApiService extends ServicesInterface {
  private static instance: FetchMyLibraryBooksApiService;

  private constructor() {
    super();
  }

  static getInstance(): FetchMyLibraryBooksApiService {
    if (!this.instance) this.instance = new FetchMyLibraryBooksApiService();
    return this.instance;
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return this.call({
      url: ApiNames.Instance.fetchMyLibraryBooks,
      type: CrudType.POST,
      auth: true,
      params,
    });
  }
}
