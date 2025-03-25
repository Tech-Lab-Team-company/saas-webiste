import { SentCodeApiService } from '~/features/ResetPasswordFeature/Data/api_services/sent_code_api_service'
import SentCodeModel from '~/features/ResetPasswordFeature/Data/models/user_model'
import RepoInterface, {ResponseType} from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'

class SentCodeRepo extends RepoInterface<SentCodeModel> {
  private static instance: SentCodeRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new SentCodeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SentCodeModel {
    return SentCodeModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return SentCodeApiService.getInstance();
  }
}

export { SentCodeRepo }
