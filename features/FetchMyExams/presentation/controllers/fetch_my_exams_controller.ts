import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type Params from "~/base/core/Params/params";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type MyExamsResource from "../../Data/models/my_exams_resource";
import FetchMyExamsUseCase from "../../Domain/use_case/fetch_my_exams_use_case";

export default class FetchMyExamsController extends ControllerInterface<MyExamsResource> {
  private static instance: FetchMyExamsController;
  private readonly useCase = new FetchMyExamsUseCase();

  private constructor() {
    super();
  }

  static getInstance(): FetchMyExamsController {
    if (!this.instance) this.instance = new FetchMyExamsController();
    return this.instance;
  }

  async fetchMyExams(params: Params) {
    this.setLoading();
    const state: DataState<MyExamsResource> = await this.useCase.call(params);
    this.setState(state);
    return this.state;
  }
}
