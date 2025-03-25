import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CityModel from "~/features/FetchCitiesFeature/Data/models/city_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchCitiesUseCase from "~/features/FetchCitiesFeature/Domain/use_case/fetch_cities_use_case";

export default class FetchCitiesController extends ControllerInterface<
    CityModel[]
> {
  private static instance: FetchCitiesController;
  private constructor() {
    super();
  }
  private FetchCitiesUseCase = new FetchCitiesUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCitiesController();
    }
    return this.instance;
  }

  async fetchCities(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<CityModel[]> =
        await this.FetchCitiesUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        return this.state;
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      return this.state;
    }
  }
}
