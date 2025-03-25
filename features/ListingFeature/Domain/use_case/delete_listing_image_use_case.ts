import type Params from '~/base/core/Params/params'
import type ListingModel from '~/features/ListingFeature/Data/models/listing_index_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteListingImageRepo } from '~/features/ListingFeature/Domain/repositories/delete_listing_image_repo'
import type ListingDetailsModel from "~/features/ListingFeature/Data/models/listing_details_model";

export default class DeleteListingImageUseCase implements UseCase<ListingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ListingDetailsModel>> {
    return DeleteListingImageRepo.getInstance().call(params)
  }
}
