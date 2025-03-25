import { InactiveApiService } from "~/features/ListingFeature/Data/api_services/inactive_listing_api_service";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

class InactiveRepo extends RepoInterface<ListingDetailsModel> {
  private static instance: InactiveRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new InactiveRepo();
    }
    return this.instance;
  }
  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: any): ListingDetailsModel {
    return ListingDetailsModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return InactiveApiService.getInstance();
  }
}

export { InactiveRepo };
