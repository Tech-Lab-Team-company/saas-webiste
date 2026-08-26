import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type FetchMyLibraryParams from "../../Core/Params/fetch_my_library_params";
import type LibraryBookModel from "../../Data/models/library_book_model";
import FetchMyLibraryBooksRepo from "../repositories/fetch_my_library_books_repo";

export default class FetchMyLibraryBooksUseCase
  implements UseCase<LibraryBookModel[], FetchMyLibraryParams>
{
  async call(
    params: FetchMyLibraryParams,
  ): Promise<DataState<LibraryBookModel[]>> {
    return FetchMyLibraryBooksRepo.getInstance().call(params);
  }
}
