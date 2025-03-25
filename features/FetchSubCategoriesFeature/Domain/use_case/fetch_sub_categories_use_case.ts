import type Params from "~/base/core/Params/params";
import type SubCategoryModel from "~/features/FetchSubCategoriesFeature/Data/models/sub_category_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchSubCategoriesRepo } from "~/features/FetchSubCategoriesFeature/Domain/repositories/fetch_sub_categories_repo";

export default class FetchSubCategoriesUseCase
  implements UseCase<SubCategoryModel[], Params>
{
  async call(params: Params): Promise<DataState<SubCategoryModel[]>> {
    return FetchSubCategoriesRepo.getInstance().call(params);
  }
}
