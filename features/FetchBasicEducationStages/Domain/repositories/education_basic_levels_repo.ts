import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { EducationBasicLevelsApiService, } from "../../Data/api_services/fetch_education_basic_levels_api_services";
import  TitleModel from "~/base/core/Models/title_model";

class EducationBasicLevelsRepo extends RepoInterface<TitleModel[]> {
  private static instance: EducationBasicLevelsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EducationBasicLevelsRepo();
    }
    return this.instance;
  }


  onParse(data: any): TitleModel[] {
    return data.map((item: any) => TitleModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return EducationBasicLevelsApiService.getInstance();
  }
}

export { EducationBasicLevelsRepo };
