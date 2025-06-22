import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import {EducationBasicStagesYearApiService, } from "../../Data/api_services/fetch_education_basic_stages_years_api_services";
import  TitleModel from "~/base/core/Models/title_model";

class EducationBasicStagesYearRepo extends RepoInterface<TitleModel[]> {
  private static instance: EducationBasicStagesYearRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EducationBasicStagesYearRepo();
    }
    return this.instance;
  }


  onParse(data: any): TitleModel[] {
    return data.map((item: any) => TitleModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return EducationBasicStagesYearApiService.getInstance();
  }
}

export { EducationBasicStagesYearRepo };
