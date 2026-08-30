// import UserModel from '~/features/ChangeOnlineStatusFeature/Data/models/user_model'
import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import UserModel from "../../Data/models/online_statue_model";
import { ChangeOnlineStatusApiService } from "../../Data/api_services/change_online_statue_service";

class ChangeOnlineStatusRepo extends RepoInterface<UserModel> {
  private static instance: ChangeOnlineStatusRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeOnlineStatusRepo();
    }
    return this.instance;
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ChangeOnlineStatusApiService.getInstance();
  }
}

export { ChangeOnlineStatusRepo };
