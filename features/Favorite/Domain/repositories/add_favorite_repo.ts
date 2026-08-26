import RepoInterface, {
  ResponseType,
} from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { AddFavoriteApiService } from "../../Data/api_services/add_favorite_api_services";

class AddFavoriteRepo extends RepoInterface<void> {
  private static instance: AddFavoriteRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddFavoriteRepo();
    }
    return this.instance;
  }


  override get responseType(): ResponseType {
    // Adding a favorite is an action. It must not depend on a particular
    // response body shape (array, object, or empty data).
    return ResponseType.withoutData;
  }

  onParse(): void {
    // `responseType` prevents this method from being called.
  }

  get serviceInstance(): ServicesInterface {
    return AddFavoriteApiService.getInstance();
  }
}

export { AddFavoriteRepo };
