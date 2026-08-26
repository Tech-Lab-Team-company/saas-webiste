import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type FetchMyLibraryParams from "../../Core/Params/fetch_my_library_params";
import FetchMyLibraryBooksUseCase from "../../Domain/use_case/fetch_my_library_books_use_case";
import type LibraryBookModel from "../../Data/models/library_book_model";

export default class FetchMyLibraryBooksController extends ControllerInterface<LibraryBookModel[]> {
  private static instance: FetchMyLibraryBooksController;
  private readonly useCase = new FetchMyLibraryBooksUseCase();

  private constructor() {
    super([]);
  }

  static getInstance(): FetchMyLibraryBooksController {
    if (!this.instance) this.instance = new FetchMyLibraryBooksController();
    return this.instance;
  }

  async fetchMyLibraryBooks(params: FetchMyLibraryParams) {
    this.setLoading();
    this.setState(await this.useCase.call(params));
    return this.state;
  }
}
