import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/FetchListingFeature/Data/models/listing_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchListingUseCase from "~/features/FetchListingFeature/Domain/use_case/fetch_listings_use_case";
import ListingModel from "~/features/FetchListingFeature/Data/models/listing_model";

export default class FetchListingController extends ControllerInterface<
  ListingModel[]
> {
  private static instance: FetchListingController;
  private constructor() {
    super();
  }
  private FetchListingUseCase = new FetchListingUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchListingController();
    }
    return this.instance;
  }

  async fetchListing(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<ListingModel[]> =
        await this.FetchListingUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        return this.state;
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      return this.state;
    }
  }
}
