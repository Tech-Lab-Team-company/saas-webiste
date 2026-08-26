import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type FetchMyLibraryParams from "../../Core/Params/fetch_my_library_params";
import type LibraryCourseModel from "../../Data/models/library_course_model";
import FetchMyLibraryCoursesRepo from "../repositories/fetch_my_library_courses_repo";

export default class FetchMyLibraryCoursesUseCase
  implements UseCase<LibraryCourseModel[], FetchMyLibraryParams>
{
  async call(
    params: FetchMyLibraryParams,
  ): Promise<DataState<LibraryCourseModel[]>> {
    return FetchMyLibraryCoursesRepo.getInstance().call(params);
  }
}
