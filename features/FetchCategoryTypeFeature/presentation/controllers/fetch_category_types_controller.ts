import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CategoryTypeModel from "~/features/FetchCategoryTypeFeature/Data/models/category_type_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchCategoryTypesUseCase from "~/features/FetchCategoryTypeFeature/Domain/use_case/fetch_category_types_use_case";

export default class FetchCategoryTypesController extends ControllerInterface<
    CategoryTypeModel[]
> {
  private static instance: FetchCategoryTypesController;
  private constructor() {
    super();
  }
  private FetchCategoryTypesUseCase = new FetchCategoryTypesUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCategoryTypesController();
    }
    return this.instance;
  }

  async fetchCategoryTypes(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<CategoryTypeModel[]> =
        await this.FetchCategoryTypesUseCase.call(params);
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
