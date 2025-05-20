import type Params from '@/base/core/Params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { CoursesPaymentRepo } from '../repositories/courses_payment_repo'
import type CoursePaymentModel from '../../Data/models/course_payment_model'

export default class CoursesPaymentUseCase implements UseCase<CoursePaymentModel, Params> {
  async call(params: Params): Promise<DataState<CoursePaymentModel>> {
    return CoursesPaymentRepo.getInstance().call(params)
  }
}
