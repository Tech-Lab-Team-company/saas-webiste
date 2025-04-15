import { VoteReviewsApiService } from "~/features/VoteReviewFeature/Data/api_services/vote_review_api_service";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { UniversityApiService } from "../../Data/api_services/university_api_services";
// import UserModel from "../../Data/models/education_stages_model";
import  TitleModel from "~/base/core/Models/title_model";

class UnviversityRepo extends RepoInterface<TitleModel[]> {
  private static instance: UnviversityRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new UnviversityRepo();
    }
    return this.instance;
  }


  onParse(data: any): TitleModel[] {
    return data.map((item: any) => TitleModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return UniversityApiService.getInstance();
  }
}

export { UnviversityRepo };
