import { SetNewPasswordApiService } from '~/features/SetNewPasswordFeature/Data/api_services/set_new_password_api_service'
import SetNewPasswordModel from '~/features/ResetPasswordFeature/Data/models/user_model'
import RepoInterface, { ResponseType } from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'

class SetNewPasswordRepo extends RepoInterface<SetNewPasswordModel> {
  private static instance: SetNewPasswordRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new SetNewPasswordRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SetNewPasswordModel {
    return SetNewPasswordModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return SetNewPasswordApiService.getInstance();
  }
}

export { SetNewPasswordRepo }
