import { VerifyCodePasswordApiService } from '~/features/VerifyCodePasswordFeature/Data/api_services/verfiy_code_api_service'
import UserModel from '~/features/VerifyCodePasswordFeature/Data/models/user_model'
import RepoInterface, { ResponseType } from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'

class VerifyCodePasswordRepo extends RepoInterface<UserModel> {
  private static instance: VerifyCodePasswordRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new VerifyCodePasswordRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return VerifyCodePasswordApiService.getInstance();
  }
}

export { VerifyCodePasswordRepo }
