import { FetchCommentsApiService } from '~/features/FetchCommentsFeature/Data/api_services/fetch_comments_api_service'
import CommentModel from '~/features/FetchCommentsFeature/Data/models/comment_model'
import RepoInterface, {ResponseType} from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'


class FetchCommentsRepo extends RepoInterface<CommentModel> {
  private static instance: FetchCommentsRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCommentsRepo()
    }
    return this.instance
  }


  onParse(data: any): CommentModel {
    return CommentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return FetchCommentsApiService.getInstance();
  }
}

export { FetchCommentsRepo }
