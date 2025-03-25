import type Params from '~/base/core/Params/params'
import type ListingModel from '~/features/ListingFeature/Data/models/listing_index_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { AddToBookmarkRepo } from '~/features/ListingFeature/Domain/repositories/add_to_bookmark_repo'
import type ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

export default class AddToBookmarkUseCase implements UseCase<ListingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ListingDetailsModel>> {
    return AddToBookmarkRepo.getInstance().call(params)
  }
}
