import { VoteReviewsApiService } from "~/features/VoteReviewFeature/Data/api_services/vote_review_api_service";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CollegeDepartmentDivisionsApiService, } from "../../Data/api_services/college_department_divisions_api_services";
// import UserModel from "../../Data/models/education_stages_model";
import  TitleModel from "~/base/core/Models/title_model";

class CollegeDepartmentDivisionsRepo extends RepoInterface<TitleModel[]> {
  private static instance: CollegeDepartmentDivisionsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CollegeDepartmentDivisionsRepo();
    }
    return this.instance;
  }


  onParse(data: any): TitleModel[] {
    return data.map((item: any) => TitleModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return CollegeDepartmentDivisionsApiService.getInstance();
  }
}

export { CollegeDepartmentDivisionsRepo };
