import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CountryModel from "~/features/FetchCountriesFeature/Data/models/country_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchCountriesUseCase from "~/features/FetchCountriesFeature/Domain/use_case/fetch_countries_use_case";
import successImage from "~/public/images/success-dialog.png";


export default class FetchCountriesController extends ControllerInterface<
    CountryModel[]
> {
  private static instance: FetchCountriesController;
  private constructor() {
    super();
  }
  private FetchCountriesUseCase = new FetchCountriesUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCountriesController();
    }
    return this.instance;
  }

  async fetchCountries(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<CountryModel[]> =
        await this.FetchCountriesUseCase.call(params);
      this.setState(dataState);
      // console.log("dataState", dataState.data);
      if (this.isDataSuccess()) {

      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      return this.state;
    }
    return this.state;
  }
}
