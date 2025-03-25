import { AddRateApiService } from '~/features/AddRateFeature/Data/api_services/add_rate_api_service'
import CommentModel from '~/features/AddRateFeature/Data/models/comment_model'
import RepoInterface, {ResponseType} from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'


class AddRateRepo extends RepoInterface<CommentModel> {
  private static instance: AddRateRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddRateRepo()
    }
    return this.instance
  }

  onParse(data: any): CommentModel {
    return CommentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return AddRateApiService.getInstance();
  }
}

export { AddRateRepo }
