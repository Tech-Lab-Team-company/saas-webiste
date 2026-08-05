import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import FetchMyExamsApiService from "../../Data/api_services/fetch_my_exams_api_service";
import MyExamsResource from "../../Data/models/my_exams_resource";

export default class FetchMyExamsRepo extends RepoInterface<MyExamsResource> {
  private static instance: FetchMyExamsRepo;

  private constructor() {
    super();
  }

  static getInstance(): FetchMyExamsRepo {
    if (!this.instance) this.instance = new FetchMyExamsRepo();
    return this.instance;
  }

  onParse(data: Record<string, any>): MyExamsResource {
    return MyExamsResource.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return FetchMyExamsApiService.getInstance();
  }
}
