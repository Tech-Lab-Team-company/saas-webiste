import type Params from "~/base/core/Params/params";
import type CommentModel from "~/features/AddRateFeature/Data/models/comment_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { AddRateRepo } from "~/features/AddRateFeature/Domain/repositories/add_rate_repo";

export default class AddRateUseCase implements UseCase<CommentModel, Params> {
  async call(params: Params): Promise<DataState<CommentModel>> {
    return AddRateRepo.getInstance().call(params);
  }
}
