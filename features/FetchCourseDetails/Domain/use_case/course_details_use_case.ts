import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { CourseDetailsRepo } from "../repositories/course_details_repo";
// import type UserModel from "../../Data/models/education_stages_model";
import type CourseDetailsModel from "../../Data/models/course_details_model";

export default class CourseDetailsUseCase
  implements UseCase<CourseDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<CourseDetailsModel>> {
    return CourseDetailsRepo.getInstance().call(params);
  }
}
