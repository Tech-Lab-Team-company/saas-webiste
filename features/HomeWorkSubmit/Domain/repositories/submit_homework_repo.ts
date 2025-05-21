import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SubmitHomeWorkModel from '../../Data/models/submit_homework_model'
import { SubmitHomeWorkApiService } from '../../Data/api_services/submit_homework_api_service'

class SubmitHomeworkRepo extends RepoInterface<SubmitHomeWorkModel> {
  private static instance: SubmitHomeworkRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new SubmitHomeworkRepo()
    }
    return this.instance
  }

  onParse(data: any): SubmitHomeWorkModel {
    return SubmitHomeWorkModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return SubmitHomeWorkApiService.getInstance();
  }

}

export { SubmitHomeworkRepo }
