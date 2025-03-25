import { SearchListingApiService } from "~/features/ListingFeature/Data/api_services/search_listing_api_service";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
// import SearchListingModel from "~/features/ListingFeature/Data/models/search_listing_model";
import ListingModel from "~/features/ListingFeature/Data/models/listing_index_model";
import SearchListingModel from "~/features/ListingFeature/Data/models/search_listing_model";

class SearchListingRepo extends RepoInterface<SearchListingModel> {
  private static instance: SearchListingRepo;

  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SearchListingRepo();
    }
    return this.instance;
  }

  // override get hasPagination(): boolean {
  //   return true;
  // }

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
    return SearchListingApiService.getInstance();
  }
}

export { SearchListingRepo };
