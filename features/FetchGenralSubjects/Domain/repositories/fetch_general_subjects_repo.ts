import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { FetchGenralSubjectsApiService } from "../../Data/api_services/fetch_general_subjects_api_services";
import GeneralSubjectsModel from "../../Data/models/general_subjects_model";

class FetchGeneralSubjectsRepo extends RepoInterface<GeneralSubjectsModel[]> {
  private static instance: FetchGeneralSubjectsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchGeneralSubjectsRepo();
    }
    return this.instance;
  }

  onParse(data: any): GeneralSubjectsModel[] {
    return data.map((item: any) => GeneralSubjectsModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchGenralSubjectsApiService.getInstance();
  }
}

export { FetchGeneralSubjectsRepo };
