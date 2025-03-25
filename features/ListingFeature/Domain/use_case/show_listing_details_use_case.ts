import type Params from '~/base/core/Params/params'
import type ListingModel from '~/features/ListingFeature/Data/models/listing_index_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { ShowListingDetailsRepo } from '~/features/ListingFeature/Domain/repositories/show_listing_details_repo'
import type ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

export default class ShowListingDetailsUseCase implements UseCase<ListingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ListingDetailsModel>> {
    return ShowListingDetailsRepo.getInstance().call(params)
  }
}
