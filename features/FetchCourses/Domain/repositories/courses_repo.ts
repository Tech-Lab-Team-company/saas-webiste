import { VoteReviewsApiService } from "~/features/VoteReviewFeature/Data/api_services/vote_review_api_service";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CoursesApiService } from "../../Data/api_services/courses_api_services";
import CoursesModel from "../../Data/models/courses_model";

class CoursesRepo extends RepoInterface<CoursesModel[]> {
  private static instance: CoursesRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CoursesRepo();
    }
    return this.instance;
  }

  onParse(data: any): CoursesModel[] {
     return data.map((item: any) => CoursesModel.fromMap(item) );
  }

  get serviceInstance(): ServicesInterface {
    return CoursesApiService.getInstance();
  }
}

export { CoursesRepo };
