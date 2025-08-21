import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { FetchGenralTeachersApiService } from "../../Data/api_services/fetch_general_teachers_api_services";
import GeneralTeachersModel from "../../Data/models/general_teachers_model";

class FetchGeneralTeachersRepo extends RepoInterface<GeneralTeachersModel[]> {
  private static instance: FetchGeneralTeachersRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchGeneralTeachersRepo();
    }
    return this.instance;
  }

  onParse(data: any): GeneralTeachersModel[] {
    return data.map((item: any) => GeneralTeachersModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchGenralTeachersApiService.getInstance();
  }
}

export { FetchGeneralTeachersRepo };
