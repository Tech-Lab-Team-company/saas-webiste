import { UpdateProfileImageApiService } from '~/features/UpdateProfileImageFeature/Data/api_services/update_profile_image_api_service'
import UserModel from '~/features/UpdateProfileImageFeature/Data/models/user_model'
import RepoInterface from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'

class UpdateProfileImageRepo extends RepoInterface<UserModel> {
  private static instance: UpdateProfileImageRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateProfileImageRepo()
    }
    return this.instance
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return UpdateProfileImageApiService.getInstance();
  }
}

export { UpdateProfileImageRepo }
