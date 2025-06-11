import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type GeneralCoursesModel from "../../Data/models/general_course_subjects_model";
import { FetchGeneralCourseSubjectsRepo } from "../repositories/fetch_general_course_subjects_repo";

export default class FetchGeneralCoursesSubjectsUseCase
  implements UseCase<GeneralCoursesModel[], Params>
{
  async call(params: Params): Promise<DataState<GeneralCoursesModel[]>> {
    return FetchGeneralCourseSubjectsRepo.getInstance().call(params);
  }
}
