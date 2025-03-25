import type Params from '~/base/core/Params/params'
import type UserModel from '~/features/VerifyCodePasswordFeature/Data/models/user_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { VerifyCodePasswordRepo } from '~/features/VerifyCodePasswordFeature/Domain/repositories/verify_code_password_repo'

export default class VerifyCodePasswordUseCase implements UseCase<UserModel, Params> {
  async call(params: Params): Promise<DataState<UserModel>> {
    return VerifyCodePasswordRepo.getInstance().call(params)
  }
}
