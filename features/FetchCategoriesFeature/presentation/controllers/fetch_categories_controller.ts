import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchCategoriesUseCase from "~/features/FetchCategoriesFeature/Domain/use_case/fetch_categories_use_case";

export default class FetchCategoriesController extends ControllerInterface<
  CategoryModel[]
> {
  private static instance: FetchCategoriesController;
  private constructor() {
    super();
  }
  private FetchCategoriesUseCase = new FetchCategoriesUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCategoriesController();
    }
    return this.instance;
  }

  async fetchCategories(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<CategoryModel[]> =
        await this.FetchCategoriesUseCase.call(params);
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
