import { EditRateApiService } from '~/features/EditRateFeature/Data/api_services/edit_rate_api_service'
import CommentModel from '~/features/EditRateFeature/Data/models/comment_model'
import RepoInterface, {ResponseType} from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'


class EditRateRepo extends RepoInterface<CommentModel> {
  private static instance: EditRateRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EditRateRepo()
    }
    return this.instance
  }

  onParse(data: any): CommentModel {
    return CommentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return EditRateApiService.getInstance();
  }
}

export { EditRateRepo }
