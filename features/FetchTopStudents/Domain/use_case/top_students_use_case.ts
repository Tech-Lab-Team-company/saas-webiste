import type TopStudentsModel from '~/features/FetchTopStudents/Data/models/top_students_model'
import { TopStudentsApiService } from '~/features/FetchTopStudents/Data/api_services/top_students_api_services'
import type Params from '~/base/core/Params/params'

class TopStudentsUseCase {
  private static instance: TopStudentsUseCase
  private apiService: TopStudentsApiService

  private constructor() {
    this.apiService = TopStudentsApiService.getInstance()
  }

  static getInstance() {    
    if (!this.instance) {
      this.instance = new TopStudentsUseCase()
    }
    return this.instance
  }

  async execute(params: Params): Promise<TopStudentsModel[]> {
    const response = await this.apiService.applyService(params)
    return response.data
  }
}

export { TopStudentsUseCase }
