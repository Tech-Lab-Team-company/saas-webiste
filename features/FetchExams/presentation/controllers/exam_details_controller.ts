import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import ExamDetailsUseCase from "../../Domain/use_case/exam_details_use_case";
import type ExamDetailsModel from "../../Data/models/exam_details_model";

export default class ExamDetailsController extends ControllerInterface<ExamDetailsModel> {
  private static instance: ExamDetailsController;
  private constructor() {
    super();
  }
  private examDetailsUseCase = new ExamDetailsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ExamDetailsController();
    }
    return this.instance;
  }

  async FetchExamDetails(params: Params) {
    this.setLoading();
    const dataState: DataState<ExamDetailsModel> =
      await this.examDetailsUseCase.call(params);
    this.setState(dataState);
    return this.state;
  }
}

