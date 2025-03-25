import type Params from '~/base/core/Params/params'
import type UserModel from '~/features/ChangePasswordFeature/Data/models/user_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { ChangePasswordRepo } from '~/features/ChangePasswordFeature/Domain/repositories/change_password_repo'

export default class ChangePasswordUseCase implements UseCase<UserModel, Params> {
  async call(params: Params): Promise<DataState<UserModel>> {
    return ChangePasswordRepo.getInstance().call(params)
  }
}
