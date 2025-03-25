import type Params from "~/base/core/Params/params";
import type UserModel from "~/features/UpdateProfileImageFeature/Data/models/user_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { UpdateProfileImageRepo } from "~/features/UpdateProfileImageFeature/Domain/repositories/update_profile_image_repo";

export default class UpdateProfileImageUseCase
  implements UseCase<UserModel, Params>
{
  async call(params: Params): Promise<DataState<UserModel>> {
    return UpdateProfileImageRepo.getInstance().call(params);
  }
}
