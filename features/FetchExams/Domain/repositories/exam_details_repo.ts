import { VoteReviewsApiService } from "~/features/VoteReviewFeature/Data/api_services/vote_review_api_service";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { ExamDetailsApiService } from "../../Data/api_services/exam_details_api_services";
// import UserModel from "../../Data/models/education_stages_model";
import ExamDetailsModel from "../../Data/models/exam_details_model";

class ExamDetailsRepo extends RepoInterface<ExamDetailsModel> {
  private static instance: ExamDetailsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ExamDetailsRepo();
    }
    return this.instance;
  }


  onParse(data: any): ExamDetailsModel {
    return  ExamDetailsModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ExamDetailsApiService.getInstance();
  }
}

export { ExamDetailsRepo };
