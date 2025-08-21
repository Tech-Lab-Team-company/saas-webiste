import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchGeneralTeachersUseCase from "../../Domain/use_case/fetch_general_teachers_use_case";
import type GeneralTeachersModel from "../../Data/models/general_teachers_model";

export default class FetchGeneralTeachersController extends ControllerInterface<
  GeneralTeachersModel[]
> {
  private static instance: FetchGeneralTeachersController;
  private constructor() {
    super();
  }
  private fetchGeneralTeachersUseCase = new FetchGeneralTeachersUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchGeneralTeachersController();
    }
    return this.instance;
  }

  async fetchGeneralTeachers(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<GeneralTeachersModel[]> =
        await this.fetchGeneralTeachersUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        return this.state;
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {}
    console.log(this.state.value.data, "this.state");
    return this.state;
  }
}
