import { DeleteReviewsApiService } from "~/features/DeleteReviewFeature/Data/api_services/delete_review_api_service";
import CommentModel from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class DeleteReviewsRepo extends RepoInterface<CommentModel> {
  private static instance: DeleteReviewsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteReviewsRepo();
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
    return DeleteReviewsApiService.getInstance();
  }
}

export { DeleteReviewsRepo };
