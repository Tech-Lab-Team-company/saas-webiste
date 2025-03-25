import type Params from "~/base/core/Params/params";
import type OtherReviewModel from "~/features/FetchReviewsFeature/Data/models/other_review_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchOtherReviewsRepo } from "~/features/FetchReviewsFeature/Domain/repositories/fetch_other_reviews_repo";

export default class FetchOtherReviewsUseCase
  implements UseCase<OtherReviewModel[], Params>
{
  async call(params: Params): Promise<DataState<OtherReviewModel[]>> {
    return FetchOtherReviewsRepo.getInstance().call(params);
  }
}
