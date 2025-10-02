import { VoteReviewsApiService } from "~/features/VoteReviewFeature/Data/api_services/vote_review_api_service";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import OnlinePaymentModel from "../../Data/models/online_payment_model";
import { OnlinePaymentApiService } from "../../Data/api_services/online_payment_api_services";

class OnlinePaymentRepo extends RepoInterface<OnlinePaymentModel> {
  private static instance: OnlinePaymentRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new OnlinePaymentRepo();
    }
    return this.instance;
  }

  // override get responseType(): ResponseType {
  //   return ResponseType.withoutData;
  // }

  onParse(data: any): OnlinePaymentModel {
    return OnlinePaymentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return OnlinePaymentApiService.getInstance();
  }
}

export { OnlinePaymentRepo };
