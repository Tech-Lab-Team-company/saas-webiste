import type Params from "~/base/core/Params/params";
import type CommentModel from "~/features/AddClaimFeature/Data/models/comment_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { AddClaimRepo } from "~/features/AddClaimFeature/Domain/repositories/add_claim_repo";

export default class AddClaimUseCase implements UseCase<CommentModel, Params> {
  async call(params: Params): Promise<DataState<CommentModel>> {
    return AddClaimRepo.getInstance().call(params);
  }
}
