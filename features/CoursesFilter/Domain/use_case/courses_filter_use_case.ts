import type Params from '@/base/core/Params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import CoursesFilterModel from '../../Data/models/courses_filter_model'
import { CoursesFilterRepo } from '../repositories/courses_filter_repo'

export default class CoursesFilterUseCase implements UseCase<CoursesFilterModel[], Params> {
  async call(params: Params): Promise<DataState<CoursesFilterModel[]>> {
    return CoursesFilterRepo.getInstance().call(params)
  }
}
