import type Params from "~/base/core/Params/params";
import type MyReviewModel from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchMyReviewsRepo } from "~/features/FetchReviewsFeature/Domain/repositories/fetch_my_reviews_repo";

export default class FetchMyReviewsUseCase
  implements UseCase<MyReviewModel[], Params>
{
  async call(params: Params): Promise<DataState<MyReviewModel[]>> {
    return FetchMyReviewsRepo.getInstance().call(params);
  }
}
