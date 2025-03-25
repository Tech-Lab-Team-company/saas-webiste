import { FetchBookmarkApiService } from "~/features/FetchBookmarkFeature/Data/api_services/fetch_bookmarks_api_service";
import BookmarkModel from "~/features/FetchBookmarkFeature/Data/models/bookmark_model";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";

class FetchBookmarkRepo extends RepoInterface<BookmarkModel[]> {
  private static instance: FetchBookmarkRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchBookmarkRepo();
    }
    return this.instance;
  }

  override get hasPagination(): boolean {
    return true;
  }

  onParse(data: any): BookmarkModel[] {
    return data.map((item: any) => BookmarkModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchBookmarkApiService.getInstance();
  }
}

export { FetchBookmarkRepo };
