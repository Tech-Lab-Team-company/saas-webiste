import type Params from '~/base/core/Params/params'
import type ListingModel from '~/features/ListingFeature/Data/models/listing_index_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { FilterListingRepo } from '~/features/ListingFeature/Domain/repositories/filter_listing_repo'
import SearchListingModel from "~/features/ListingFeature/Data/models/search_listing_model";

export default class FilterListingUseCase implements UseCase<SearchListingModel, Params> {
  async call(params: Params): Promise<DataState<SearchListingModel>> {
    return FilterListingRepo.getInstance().call(params)
  }
}
