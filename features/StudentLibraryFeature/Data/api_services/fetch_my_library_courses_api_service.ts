import ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CrudType } from "~/base/core/Params/call_params_interface";
import type Params from "~/base/core/Params/params";
import { ApiNames } from "~/base/core/networkStructure/apiNames";

export default class FetchMyLibraryCoursesApiService extends ServicesInterface {
  private static instance: FetchMyLibraryCoursesApiService;

  private constructor() {
    super();
  }

  static getInstance(): FetchMyLibraryCoursesApiService {
    if (!this.instance) this.instance = new FetchMyLibraryCoursesApiService();
    return this.instance;
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return this.call({
      url: ApiNames.Instance.fetchMyLibraryCourses,
      type: CrudType.POST,
      auth: true,
      params,
    });
  }
}
