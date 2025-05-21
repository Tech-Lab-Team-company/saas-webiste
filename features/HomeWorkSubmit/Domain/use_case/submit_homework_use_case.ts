import type Params from '@/base/core/Params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { SubmitHomeworkRepo } from '../repositories/submit_homework_repo'
import type SubmitHomeWorkModel from '../../Data/models/submit_homework_model'

export default class SubmitHomeworkUseCase implements UseCase<SubmitHomeWorkModel, Params> {
  async call(params: Params): Promise<DataState<SubmitHomeWorkModel>> {
    return SubmitHomeworkRepo.getInstance().call(params)
  }
}
