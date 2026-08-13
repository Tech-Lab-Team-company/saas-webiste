import type TopStudentsModel from '~/features/FetchTopStudents/Data/models/top_students_model'
import type Params from '~/base/core/Params/params'

abstract class TopStudentsRepository {
  abstract fetchTopStudents(params: Params): Promise<TopStudentsModel>
}

export { TopStudentsRepository }
