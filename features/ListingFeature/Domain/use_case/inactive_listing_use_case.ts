import type Params from '~/base/core/Params/params'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { InactiveRepo } from '~/features/ListingFeature/Domain/repositories/inactive_listing_repo'
import type ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

export default class InactiveUseCase implements UseCase<ListingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ListingDetailsModel>> {
    return InactiveRepo.getInstance().call(params)
  }
}
