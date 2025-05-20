import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CoursePaymentModel from '../../Data/models/course_payment_model'
import { CoursesPaymentApiService } from '../../Data/api_services/courses_payment_api_service'

class CoursesPaymentRepo extends RepoInterface<CoursePaymentModel> {
  private static instance: CoursesPaymentRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CoursesPaymentRepo()
    }
    return this.instance
  }

  onParse(data: any): CoursePaymentModel {
    return CoursePaymentModel.fromMap(data)
    // return data.map((item: any) => CoursesFilterModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return CoursesPaymentApiService.getInstance();
  }

}

export { CoursesPaymentRepo }
