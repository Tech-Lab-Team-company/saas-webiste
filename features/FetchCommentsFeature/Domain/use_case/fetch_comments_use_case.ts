import type Params from "~/base/core/Params/params";
import type CommentModel from "~/features/FetchCommentsFeature/Data/models/comment_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchCommentsRepo } from "~/features/FetchCommentsFeature/Domain/repositories/fetch_comments_repo";

export default class FetchCommentsUseCase
  implements UseCase<CommentModel, Params>
{
  async call(params: Params): Promise<DataState<CommentModel>> {
    return FetchCommentsRepo.getInstance().call(params);
  }
}
