import type Params from '~/base/core/Params/params'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { ViewListingDetailsRepo } from '~/features/ListingFeature/Domain/repositories/view_listing_details_repo'
import ViewListingDetailsModel from "~/features/ListingFeature/Data/models/view_listing_details_model";

export default class ViewListingDetailsUseCase implements UseCase<ViewListingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ViewListingDetailsModel>> {
    return ViewListingDetailsRepo.getInstance().call(params)
  }
}
