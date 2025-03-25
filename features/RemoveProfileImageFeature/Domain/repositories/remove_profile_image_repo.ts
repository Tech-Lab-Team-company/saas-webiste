import { RemoveProfileImageApiService } from '~/features/RemoveProfileImageFeature/Data/api_services/remove_profile_image_api_service'
import UserModel from '~/features/RemoveProfileImageFeature/Data/models/user_model'
import RepoInterface from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'

class RemoveProfileImageRepo extends RepoInterface<UserModel> {
  private static instance: RemoveProfileImageRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new RemoveProfileImageRepo()
    }
    return this.instance
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return RemoveProfileImageApiService.getInstance();
  }
}

export { RemoveProfileImageRepo }
