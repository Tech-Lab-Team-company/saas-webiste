import type Params from "~/base/core/Params/params";
import type BookmarkModel from "~/features/FetchBookmarkFeature/Data/models/bookmark_model";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchBookmarkRepo } from "~/features/FetchBookmarkFeature/Domain/repositories/fetch_bookmarks_repo";

export default class FetchBookmarkUseCase
  implements UseCase<BookmarkModel[], Params>
{
  async call(params: Params): Promise<DataState<BookmarkModel[]>> {
    return FetchBookmarkRepo.getInstance().call(params);
  }
}
