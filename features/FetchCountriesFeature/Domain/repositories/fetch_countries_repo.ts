import { FetchCountriesApiService } from "~/features/FetchCountriesFeature/Data/api_services/fetch_countries_api_service";
import CountryModel from "~/features/FetchCountriesFeature/Data/models/country_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchCountriesRepo extends RepoInterface<CountryModel[]> {
  private static instance: FetchCountriesRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCountriesRepo();
    }
    return this.instance;
  }

  onParse(data: any): CountryModel[] {
    return data.map((item: any) => CountryModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchCountriesApiService.getInstance();
  }
}

export { FetchCountriesRepo };
