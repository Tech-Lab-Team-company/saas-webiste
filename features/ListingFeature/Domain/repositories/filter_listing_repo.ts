import { FilterListingApiService } from "~/features/ListingFeature/Data/api_services/filter_listing_api_service";
import ListingModel from "~/features/ListingFeature/Data/models/listing_index_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import SearchListingModel from "~/features/ListingFeature/Data/models/search_listing_model";

class FilterListingRepo extends RepoInterface<SearchListingModel> {
  private static instance: FilterListingRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FilterListingRepo();
    }
    return this.instance;
  }

  onParse(data: any): SearchListingModel {
    // Handle the nested structure of the listings
    const listings: ListingModel[] = [];
    const similarListings: ListingModel[] = [];
    if (data) {
      console.log(data.listings);
      if (!data.listings) {
        data.similar_listings.forEach((item: any) =>
            similarListings.push(item),
        );
      } else {
        data.listings.data.forEach((item: any) => listings.push(item));
      }
    }
    const mappedData = {
      listings: listings,
      similar_listings: similarListings,
    };
    return SearchListingModel.fromMap(mappedData);
  }

  get serviceInstance(): ServicesInterface {
    return FilterListingApiService.getInstance();
  }
}

export { FilterListingRepo };
