import type Params from "~/base/core/Params/params";
import type CountryModel from "~/features/FetchCountriesFeature/Data/models/country_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchCountriesRepo } from "~/features/FetchCountriesFeature/Domain/repositories/fetch_countries_repo";

export default class FetchCountriesUseCase
  implements UseCase<CountryModel[], Params>
{
  async call(params: Params): Promise<DataState<CountryModel[]>> {
    return FetchCountriesRepo.getInstance().call(params);
  }
}
