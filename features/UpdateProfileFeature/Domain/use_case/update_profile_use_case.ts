import type Params from '~/base/core/Params/params'
import UserModel from "~/features/LoginFeature/Data/models/user_model";
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { UpdateProfileRepo } from '~/features/UpdateProfileFeature/Domain/repositories/update_profile_repo'

export default class UpdateProfileUseCase implements UseCase<UserModel, Params> {
  async call(params: Params): Promise<DataState<UserModel>> {
    return UpdateProfileRepo.getInstance().call(params)
  }
}
