import { FetchCitiesApiService } from "~/features/FetchCitiesFeature/Data/api_services/fetch_cities_api_service";
import CityModel from "~/features/FetchCitiesFeature/Data/models/city_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchCitiesRepo extends RepoInterface<CityModel[]> {
  private static instance: FetchCitiesRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCitiesRepo();
    }
    return this.instance;
  }

  onParse(data: any): CityModel[] {
    return data.map((item: any) => CityModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchCitiesApiService.getInstance();
  }
}

export { FetchCitiesRepo };
