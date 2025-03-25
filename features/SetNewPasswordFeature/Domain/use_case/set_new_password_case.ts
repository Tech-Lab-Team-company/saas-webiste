import type Params from '~/base/core/Params/params'
import type SetNewPasswordModel from '~/features/ResetPasswordFeature/Data/models/user_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { SetNewPasswordRepo } from '~/features/SetNewPasswordFeature/Domain/repositories/set_new_password_repo'

export default class SetNewPasswordUseCase implements UseCase<SetNewPasswordModel, Params> {
  async call(params: Params): Promise<DataState<SetNewPasswordModel>> {
    return SetNewPasswordRepo.getInstance().call(params)
  }
}
