import { FetchOtherReviewsApiService } from "~/features/FetchReviewsFeature/Data/api_services/fetch_other_reviews_api_service";
import OtherReviewModel from "~/features/FetchReviewsFeature/Data/models/other_review_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchOtherReviewsRepo extends RepoInterface<OtherReviewModel[]> {
  private static instance: FetchOtherReviewsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchOtherReviewsRepo();
    }
    return this.instance;
  }

  override get hasPagination(): boolean {
    return true;
  }

  onParse(data: any): OtherReviewModel[] {
    return data.map((item: any) => OtherReviewModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchOtherReviewsApiService.getInstance();
  }
}

export { FetchOtherReviewsRepo };
