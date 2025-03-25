import { ViewListingDetailsApiService } from "~/features/ListingFeature/Data/api_services/view_listing_details_api_service";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import ViewListingDetailsModel from "~/features/ListingFeature/Data/models/view_listing_details_model";

class ViewListingDetailsRepo extends RepoInterface<ViewListingDetailsModel> {
  private static instance: ViewListingDetailsRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ViewListingDetailsRepo();
    }
    return this.instance;
  }

  onParse(data: any): ViewListingDetailsModel {
    return ViewListingDetailsModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ViewListingDetailsApiService.getInstance();
  }
}

export { ViewListingDetailsRepo };
