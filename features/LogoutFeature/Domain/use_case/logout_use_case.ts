import type Params from '~/base/core/Params/params'
import type UserModel from '~/features/LogoutFeature/Data/models/user_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { LogoutRepo } from '~/features/LogoutFeature/Domain/repositories/logout_repo'

export default class LogoutUseCase implements UseCase<UserModel, Params> {
  async call(): Promise<DataState<UserModel>> {
    return LogoutRepo.getInstance().call()
  }
}
