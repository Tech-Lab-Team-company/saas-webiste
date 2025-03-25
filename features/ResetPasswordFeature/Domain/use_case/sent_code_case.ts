import type Params from '~/base/core/Params/params'
import type SentCodeModel from '~/features/ResetPasswordFeature/Data/models/user_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { SentCodeRepo } from '~/features/ResetPasswordFeature/Domain/repositories/sent_code_repo'

export default class SentCodeUseCase implements UseCase<SentCodeModel, Params> {
  async call(params: Params): Promise<DataState<SentCodeModel>> {
    return SentCodeRepo.getInstance().call(params)
  }
}
