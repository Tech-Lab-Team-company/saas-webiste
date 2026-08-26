import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type FetchMyLibraryParams from "../../Core/Params/fetch_my_library_params";
import FetchMyLibraryCoursesUseCase from "../../Domain/use_case/fetch_my_library_courses_use_case";
import type LibraryCourseModel from "../../Data/models/library_course_model";

export default class FetchMyLibraryCoursesController extends ControllerInterface<LibraryCourseModel[]> {
  private static instance: FetchMyLibraryCoursesController;
  private readonly useCase = new FetchMyLibraryCoursesUseCase();

  private constructor() {
    super([]);
  }

  static getInstance(): FetchMyLibraryCoursesController {
    if (!this.instance) this.instance = new FetchMyLibraryCoursesController();
    return this.instance;
  }

  async fetchMyLibraryCourses(params: FetchMyLibraryParams) {
    this.setLoading();
    this.setState(await this.useCase.call(params));
    return this.state;
  }
}
