import { FetchListingApiService } from "~/features/FetchListingFeature/Data/api_services/fetch_listings_api_service";
import ListingModel from "~/features/FetchListingFeature/Data/models/listing_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchListingRepo extends RepoInterface<ListingModel[]> {
  private static instance: FetchListingRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchListingRepo();
    }
    return this.instance;
  }

  override get hasPagination(): boolean {
    return true;
  }

  onParse(data: any): ListingModel[] {
    return data.map((item: any) => ListingModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchListingApiService.getInstance();
  }
}

export { FetchListingRepo };
