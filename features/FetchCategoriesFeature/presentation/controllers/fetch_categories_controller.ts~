import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import Bookmark from "~/features/FetchBookmarkFeature/Data/models/bookmark_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchBookmarkUseCase from "~/features/FetchBookmarkFeature/Domain/use_case/fetch_bookmarks_use_case";

export default class FetchBookmarkController extends ControllerInterface<
  Bookmark[]
> {
  private static instance: FetchBookmarkController;
  private constructor() {
    super();
  }
  private FetchBookmarkUseCase = new FetchBookmarkUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchBookmarkController();
    }
    return this.instance;
  }

  async fetchBookmark(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<Bookmark[]> =
        await this.FetchBookmarkUseCase.call(params);
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
