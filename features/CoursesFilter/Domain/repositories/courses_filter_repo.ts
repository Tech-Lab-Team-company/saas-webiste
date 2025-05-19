import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import CoursesFilterModel from '../../Data/models/courses_filter_model'
import { CoursesFilterApiService } from '../../Data/api_services/courses_filter_api_service'

class CoursesFilterRepo extends RepoInterface<CoursesFilterModel[]> {
  private static instance: CoursesFilterRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new CoursesFilterRepo()
    }
    return this.instance
  }

  onParse(data: any): CoursesFilterModel[] {
    return data.map((item: any) => CoursesFilterModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return CoursesFilterApiService.getInstance();
  }

}

export { CoursesFilterRepo }
