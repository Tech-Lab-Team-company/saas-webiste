import { DeleteListingImageApiService } from "~/features/ListingFeature/Data/api_services/delete_listing_image_api_service";
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

class DeleteListingImageRepo extends RepoInterface<ListingDetailsModel> {
  private static instance: DeleteListingImageRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteListingImageRepo();
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
    return DeleteListingImageApiService.getInstance();
  }
}

export { DeleteListingImageRepo };
