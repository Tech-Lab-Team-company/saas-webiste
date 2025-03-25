import { AddClaimApiService } from '~/features/AddClaimFeature/Data/api_services/add_claim_api_service'
import CommentModel from '~/features/AddClaimFeature/Data/models/comment_model'
import RepoInterface, {ResponseType} from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'


class AddClaimRepo extends RepoInterface<CommentModel> {
  private static instance: AddClaimRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddClaimRepo()
    }
    return this.instance
  }



  onParse(data: any): CommentModel {
    return CommentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return AddClaimApiService.getInstance();
  }
}

export { AddClaimRepo }
