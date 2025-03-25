import { FetchCategoryTypesApiService } from "~/features/FetchCategoryTypeFeature/Data/api_services/fetch_category_types_api_service";
import CategoryTypeModel from "~/features/FetchCategoryTypeFeature/Data/models/category_type_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchCategoryTypesRepo extends RepoInterface<CategoryTypeModel[]> {
  private static instance: FetchCategoryTypesRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCategoryTypesRepo();
    }
    return this.instance;
  }

  onParse(data: any): CategoryTypeModel[] {
    return data.map((item: any) => CategoryTypeModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchCategoryTypesApiService.getInstance();
  }
}

export { FetchCategoryTypesRepo };
