import { ShowListingDetailsApiService } from "~/features/ListingFeature/Data/api_services/show_listing_details_api_service";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

class ShowListingDetailsRepo extends RepoInterface<ListingDetailsModel> {
  private static instance: ShowListingDetailsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowListingDetailsRepo();
    }
    return this.instance;
  }

  onParse(data: any): ListingDetailsModel {
    return ListingDetailsModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ShowListingDetailsApiService.getInstance();
  }
}

export { ShowListingDetailsRepo };
