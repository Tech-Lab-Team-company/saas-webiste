import { MakeCommentApiService } from '~/features/MakeCommentFeature/Data/api_services/make_comment_api_service'
import CommentModel from '~/features/MakeCommentFeature/Data/models/comment_model'
import RepoInterface, {ResponseType} from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'


class MakeCommentRepo extends RepoInterface<CommentModel> {
  private static instance: MakeCommentRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new MakeCommentRepo()
    }
    return this.instance
  }


  override get responseType(): ResponseType {
    return ResponseType.withoutData; // Or any value you want to return
  }
  onParse(data: any): CommentModel {
    return CommentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return MakeCommentApiService.getInstance();
  }
}

export { MakeCommentRepo }
