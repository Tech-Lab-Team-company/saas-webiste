import type Params from "~/base/core/Params/params";
import type CommentModel from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { DeleteReviewsRepo } from "~/features/DeleteReviewFeature/Domain/repositories/delete_review_repo";

export default class DeleteReviewsUseCase
  implements UseCase<CommentModel, Params>
{
  async call(params: Params): Promise<DataState<CommentModel>> {
    return DeleteReviewsRepo.getInstance().call(params);
  }
}
