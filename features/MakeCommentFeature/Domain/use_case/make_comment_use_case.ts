import type Params from "~/base/core/Params/params";
import type CommentModel from "~/features/MakeCommentFeature/Data/models/user_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { MakeCommentRepo } from "~/features/MakeCommentFeature/Domain/repositories/make_comment_repo";

export default class MakeCommentUseCase
  implements UseCase<CommentModel, Params>
{
  async call(params: Params): Promise<DataState<CommentModel>> {
    return MakeCommentRepo.getInstance().call(params);
  }
}
