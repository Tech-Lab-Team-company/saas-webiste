import type Params from '~/base/core/Params/params'
import type ListingModel from '~/features/ListingFeature/Data/models/listing_index_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { UpdateListingRepo } from '~/features/ListingFeature/Domain/repositories/update_listing_repo'

export default class UpdateListingUseCase implements UseCase<ListingModel[], Params> {
  async call(params: Params): Promise<DataState<ListingModel[]>> {
    return UpdateListingRepo.getInstance().call(params)
  }
}
