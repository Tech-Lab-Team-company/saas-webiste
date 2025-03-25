import { AddListingApiService } from "~/features/ListingFeature/Data/api_services/add_listing_api_service";
import ListingModel from "~/features/ListingFeature/Data/models/listing_index_model";
import RepoInterface, {ResponseType} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class AddListingRepo extends RepoInterface<ListingModel[]> {
  private static instance: AddListingRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddListingRepo();
    }
    return this.instance;
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData; // Or any value you want to return
  }

  onParse(data: any): ListingModel[] {
    return data.map((item: any) => ListingModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return AddListingApiService.getInstance();
  }
}

export { AddListingRepo };
