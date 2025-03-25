import { FetchMyReviewsApiService } from "~/features/FetchReviewsFeature/Data/api_services/fetch_my_reviews_api_service";
import MyReviewModel from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchMyReviewsRepo extends RepoInterface<MyReviewModel[]> {
  private static instance: FetchMyReviewsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyReviewsRepo();
    }
    return this.instance;
  }

  override get hasPagination(): boolean {
    return true;
  }

  onParse(data: any): MyReviewModel[] {
    return data.map((item: any) => MyReviewModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchMyReviewsApiService.getInstance();
  }
}

export { FetchMyReviewsRepo };
