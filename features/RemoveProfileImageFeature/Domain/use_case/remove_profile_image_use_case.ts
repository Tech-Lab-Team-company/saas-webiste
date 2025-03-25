import type Params from "~/base/core/Params/params";
import type UserModel from "~/features/RemoveProfileImageFeature/Data/models/user_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { RemoveProfileImageRepo } from "~/features/RemoveProfileImageFeature/Domain/repositories/remove_profile_image_repo";

export default class RemoveProfileImageUseCase
  implements UseCase<UserModel, Params>
{
  async call(): Promise<DataState<UserModel>> {
    return RemoveProfileImageRepo.getInstance().call();
  }
}
