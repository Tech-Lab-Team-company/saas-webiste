import type Params from "~/base/core/Params/params";
import type CityModel from "~/features/FetchCitiesFeature/Data/models/city_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchCitiesRepo } from "~/features/FetchCitiesFeature/Domain/repositories/fetch_cities_repo";

export default class FetchCitiesUseCase
  implements UseCase<CityModel[], Params>
{
  async call(params: Params): Promise<DataState<CityModel[]>> {
    return FetchCitiesRepo.getInstance().call(params);
  }
}
