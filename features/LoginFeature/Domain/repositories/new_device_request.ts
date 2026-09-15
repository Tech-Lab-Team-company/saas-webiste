import { LoginApiService } from '~/features/LoginFeature/Data/api_services/login_api_service'
import UserModel from '~/features/LoginFeature/Data/models/user_model'
import RepoInterface, { ResponseType } from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import { NewDeviceRequestApiService } from '../../Data/api_services/new_device_request_api_service'

class NewDeviceRequestRepo extends RepoInterface<UserModel> {
  private static instance: NewDeviceRequestRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new NewDeviceRequestRepo()
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
    console.log('NewDeviceRequestRepo serviceInstance called');
    return NewDeviceRequestApiService.getInstance();
  }
}

export { NewDeviceRequestRepo }



