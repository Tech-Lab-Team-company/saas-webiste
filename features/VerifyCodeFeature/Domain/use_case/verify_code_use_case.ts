import type Params from '~/base/core/Params/params'
import type UserModel from '~/features/VerifyCodeFeature/Data/models/user_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { VerifyCodeRepo } from '~/features/VerifyCodeFeature/Domain/repositories/verify_code_repo'

export default class VerifyCodeUseCase implements UseCase<UserModel, Params> {
  async call(params: Params): Promise<DataState<UserModel>> {
    return VerifyCodeRepo.getInstance().call(params)
  }
}
