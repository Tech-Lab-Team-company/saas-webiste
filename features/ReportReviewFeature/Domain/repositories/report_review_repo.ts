import { ReportReviewsApiService } from "~/features/ReportReviewFeature/Data/api_services/report_review_api_service";
import CommentModel from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class ReportReviewsRepo extends RepoInterface<CommentModel> {
  private static instance: ReportReviewsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ReportReviewsRepo();
    }
    return this.instance;
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): CommentModel {
    return CommentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ReportReviewsApiService.getInstance();
  }
}

export { ReportReviewsRepo };
