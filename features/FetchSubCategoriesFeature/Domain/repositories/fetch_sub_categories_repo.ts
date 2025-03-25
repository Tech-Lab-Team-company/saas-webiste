import { FetchSubCategoriesApiService } from "~/features/FetchSubCategoriesFeature/Data/api_services/fetch_sub_categories_api_service";
import SubCategoryModel from "~/features/FetchSubCategoriesFeature/Data/models/sub_category_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchSubCategoriesRepo extends RepoInterface<SubCategoryModel[]> {
  private static instance: FetchSubCategoriesRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchSubCategoriesRepo();
    }
    return this.instance;
  }

  onParse(data: any): SubCategoryModel[] {
    return data.map((item: any) => SubCategoryModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchSubCategoriesApiService.getInstance();
  }
}

export { FetchSubCategoriesRepo };
