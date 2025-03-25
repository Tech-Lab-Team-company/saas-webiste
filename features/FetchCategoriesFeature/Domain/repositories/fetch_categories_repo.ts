import { FetchCategoriesApiService } from "~/features/FetchCategoriesFeature/Data/api_services/fetch_categories_api_service";
import CategoryModel from "~/features/FetchCategoriesFeature/Data/models/category_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchCategoriesRepo extends RepoInterface<CategoryModel[]> {
  private static instance: FetchCategoriesRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCategoriesRepo();
    }
    return this.instance;
  }

  onParse(data: any): CategoryModel[] {
    return data.map((item: any) => CategoryModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchCategoriesApiService.getInstance();
  }
}

export { FetchCategoriesRepo };
