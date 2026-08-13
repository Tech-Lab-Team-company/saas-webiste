import { TopStudentsUseCase } from '~/features/FetchTopStudents/Domain/use_case/top_students_use_case'
import type Params from '~/base/core/Params/params'

class TopStudentsController {
  private static instance: TopStudentsController
  private useCase: TopStudentsUseCase

  private constructor() {
    this.useCase = TopStudentsUseCase.getInstance()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new TopStudentsController()
    }
    return this.instance
  }

  async execute(params: Params) {
    return await this.useCase.execute(params)
  }
}

export { TopStudentsController }
