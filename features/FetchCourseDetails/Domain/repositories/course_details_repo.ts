import { VoteReviewsApiService } from "~/features/VoteReviewFeature/Data/api_services/vote_review_api_service";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CourseDetailsApiService } from "../../Data/api_services/course_details_api_services";
// import UserModel from "../../Data/models/education_stages_model";
import  TitleModel from "~/base/core/Models/title_model";
import CourseDetailsModel from "../../Data/models/course_details_model";

class CourseDetailsRepo extends RepoInterface<CourseDetailsModel> {
  private static instance: CourseDetailsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CourseDetailsRepo();
    }
    return this.instance;
  }


  onParse(data: any): CourseDetailsModel {
    return  CourseDetailsModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return CourseDetailsApiService.getInstance();
  }
}

export { CourseDetailsRepo };
