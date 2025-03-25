import type Params from '~/base/core/Params/params'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteRateImageRepo } from '~/features/EditRateFeature/Domain/repositories/delete_rate_image_repo'
import type RateDetailsModel from "~/features/EditRateFeature/Data/models/comment_model";

export default class DeleteRateImageUseCase implements UseCase<RateDetailsModel, Params> {
  async call(params: Params): Promise<DataState<RateDetailsModel>> {
    return DeleteRateImageRepo.getInstance().call(params)
  }
}
