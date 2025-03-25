import type Params from "~/base/core/Params/params";
import type CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchCategoriesRepo } from "~/features/FetchCategoriesFeature/Domain/repositories/fetch_categories_repo";

export default class FetchCategoriesUseCase
  implements UseCase<CategoryModel[], Params>
{
  async call(params: Params): Promise<DataState<CategoryModel[]>> {
    return FetchCategoriesRepo.getInstance().call(params);
  }
}
