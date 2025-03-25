import { UpdateProfileApiService } from '~/features/UpdateProfileFeature/Data/api_services/update_profile_api_service'
import UserModel from "~/features/LoginFeature/Data/models/user_model";
import RepoInterface from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'

class UpdateProfileRepo extends RepoInterface<UserModel> {
  private static instance: UpdateProfileRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateProfileRepo()
    }
    return this.instance
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return UpdateProfileApiService.getInstance();
  }
}

export { UpdateProfileRepo }
