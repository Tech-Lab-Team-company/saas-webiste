import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { EducationBasicSubjectsApiService, } from "../../Data/api_services/fetch_education_basic_subjects_api_services";
import  TitleModel from "~/base/core/Models/title_model";

class EducationBasicSubjectsRepo extends RepoInterface<TitleModel[]> {
  private static instance: EducationBasicSubjectsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EducationBasicSubjectsRepo();
    }
    return this.instance;
  }


  onParse(data: any): TitleModel[] {
    return data.map((item: any) => TitleModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return EducationBasicSubjectsApiService.getInstance();
  }
}

export { EducationBasicSubjectsRepo };
