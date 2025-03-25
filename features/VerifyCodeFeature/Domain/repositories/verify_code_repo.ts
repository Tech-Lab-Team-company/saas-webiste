import { VerifyCodeApiService } from '~/features/VerifyCodeFeature/Data/api_services/verfiy_code_api_service'
import UserModel from '~/features/VerifyCodeFeature/Data/models/user_model'
import RepoInterface from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'

class VerifyCodeRepo extends RepoInterface<UserModel> {
  private static instance: VerifyCodeRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new VerifyCodeRepo()
    }
    return this.instance
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return VerifyCodeApiService.getInstance();
  }
}

export { VerifyCodeRepo }
