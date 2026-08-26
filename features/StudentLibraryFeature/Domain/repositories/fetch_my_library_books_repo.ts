import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import FetchMyLibraryBooksApiService from "../../Data/api_services/fetch_my_library_books_api_service";
import LibraryBookModel from "../../Data/models/library_book_model";
import { extractLibraryRecords } from "../../Data/models/library_item_utils";

export default class FetchMyLibraryBooksRepo extends RepoInterface<LibraryBookModel[]> {
  private static instance: FetchMyLibraryBooksRepo;

  private constructor() {
    super();
  }

  static getInstance(): FetchMyLibraryBooksRepo {
    if (!this.instance) this.instance = new FetchMyLibraryBooksRepo();
    return this.instance;
  }

  onParse(data: unknown): LibraryBookModel[] {
    return extractLibraryRecords(data)
      .map(LibraryBookModel.fromMap)
      .filter((book): book is LibraryBookModel => book !== null);
  }

  get serviceInstance(): ServicesInterface {
    return FetchMyLibraryBooksApiService.getInstance();
  }
}
