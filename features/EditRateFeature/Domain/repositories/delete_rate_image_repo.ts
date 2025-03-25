import { DeleteRateImageApiService } from "~/features/EditRateFeature/Data/api_services/delete_rate_image_api_service";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import RateDetailsModel from "~/features/EditRateFeature/Data/models/comment_model";

class DeleteRateImageRepo extends RepoInterface<RateDetailsModel> {
  private static instance: DeleteRateImageRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteRateImageRepo();
    }
    return this.instance;
  }
  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: any): RateDetailsModel {
    return RateDetailsModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return DeleteRateImageApiService.getInstance();
  }
}

export { DeleteRateImageRepo };
