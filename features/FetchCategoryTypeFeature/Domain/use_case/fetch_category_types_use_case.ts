import type Params from "~/base/core/Params/params";
import type CategoryTypeModel from "~/features/FetchCategoryTypeFeature/Data/models/category_type_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchCategoryTypesRepo } from "~/features/FetchCategoryTypeFeature/Domain/repositories/fetch_category_types_repo";

export default class FetchCategoryTypesUseCase
  implements UseCase<CategoryTypeModel[], Params>
{
  async call(params: Params): Promise<DataState<CategoryTypeModel[]>> {
    return FetchCategoryTypesRepo.getInstance().call(params);
  }
}
