import { LogoutApiService } from '~/features/LogoutFeature/Data/api_services/logout_api_service'
import UserModel from '~/features/LogoutFeature/Data/models/user_model'
import RepoInterface from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'

class LogoutRepo extends RepoInterface<UserModel> {
  private static instance: LogoutRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new LogoutRepo()
    }
    return this.instance
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return LogoutApiService.getInstance();
  }
}

export { LogoutRepo }
