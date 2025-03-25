import type Params from '~/base/core/Params/params'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { SearchListingRepo } from '~/features/ListingFeature/Domain/repositories/search_listing_repo'
import SearchListingModel from "~/features/ListingFeature/Data/models/search_listing_model";
import ListingModel from "~/features/FetchListingFeature/Data/models/listing_model";

export default class SearchListingUseCase implements UseCase<SearchListingModel, Params> {
  async call(params: Params): Promise<DataState<SearchListingModel>> {
    console.log("params")
    return SearchListingRepo.getInstance().call(params)
  }
}
