import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import {  CoursesRepo } from "../repositories/courses_repo";
import type CoursesModel from "../../Data/models/courses_model";

export default class CoursesUseCase
  implements UseCase<CoursesModel[], Params>
{
  async call(params: Params): Promise<DataState<CoursesModel[]>> {
    return CoursesRepo.getInstance().call(params);
  }
}
