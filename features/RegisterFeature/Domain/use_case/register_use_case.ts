import type Params from '~/base/core/Params/params'
import type UserModel from '~/features/RegisterFeature/Data/models/user_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { RegisterRepo } from '~/features/RegisterFeature/Domain/repositories/register_repo'

export default class RegisterUseCase implements UseCase<UserModel, Params> {
  async call(params: Params): Promise<DataState<UserModel>> {
    return RegisterRepo.getInstance().call(params)
  }
}
