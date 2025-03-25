import type Params from '~/base/core/Params/params'
import type ListingModel from '~/features/ListingFeature/Data/models/listing_index_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { UpdateListingImageRepo } from '~/features/ListingFeature/Domain/repositories/update_listing_image_repo'
import type ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

export default class UpdateListingImageUseCase implements UseCase<ListingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ListingDetailsModel>> {
    return UpdateListingImageRepo.getInstance().call(params)
  }
}
