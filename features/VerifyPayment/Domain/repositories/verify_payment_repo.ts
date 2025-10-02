import { VoteReviewsApiService } from "~/features/VoteReviewFeature/Data/api_services/vote_review_api_service";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import VerifyPaymentModel from "../../Data/models/verify_payment_model";
import { VerifyPaymentApiService } from "../../Data/api_services/verify_payment_api_services";

class VerifyPaymentRepo extends RepoInterface<VerifyPaymentModel> {
  private static instance: VerifyPaymentRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new VerifyPaymentRepo();
    }
    return this.instance;
  }

  // override get responseType(): ResponseType {
  //   return ResponseType.withoutData;
  // }

  onParse(data: any): VerifyPaymentModel {
    return VerifyPaymentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return VerifyPaymentApiService.getInstance();
  }
}

export { VerifyPaymentRepo };
