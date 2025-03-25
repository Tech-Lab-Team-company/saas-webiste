import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import SubCategoryModel from "~/features/FetchSubCategoriesFeature/Data/models/sub_category_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchSubCategoriesUseCase from "~/features/FetchSubCategoriesFeature/Domain/use_case/fetch_sub_categories_use_case";

export default class FetchSubCategoriesController extends ControllerInterface<
    SubCategoryModel[]
> {
  private static instance: FetchSubCategoriesController;
  private constructor() {
    super();
  }
  private FetchSubCategoriesUseCase = new FetchSubCategoriesUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchSubCategoriesController();
    }
    return this.instance;
  }

  async fetchSubCategories(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<SubCategoryModel[]> =
        await this.FetchSubCategoriesUseCase.call(params);
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
