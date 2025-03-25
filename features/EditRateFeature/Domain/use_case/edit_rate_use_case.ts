import type Params from "~/base/core/Params/params";
import type CommentModel from "~/features/EditRateFeature/Data/models/comment_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { EditRateRepo } from "~/features/EditRateFeature/Domain/repositories/edit_rate_repo";

export default class EditRateUseCase implements UseCase<CommentModel, Params> {
  async call(params: Params): Promise<DataState<CommentModel>> {
    return EditRateRepo.getInstance().call(params);
  }
}
