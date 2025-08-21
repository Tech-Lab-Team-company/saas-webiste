import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import type GeneralSubjectsModel from "../../Data/models/general_subjects_model";
import FetchGeneralSubjectsUseCase from "../../Domain/use_case/fetch_general_subjects_use_case";

export default class FetchGeneralSubjectController extends ControllerInterface<
  GeneralSubjectsModel[]
> {
  private static instance: FetchGeneralSubjectController;
  private constructor() {
    super();
  }
  private fetchGeneralSubjectsUseCase = new FetchGeneralSubjectsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchGeneralSubjectController();
    }
    return this.instance;
  }

  async fetchGeneralSubject(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<GeneralSubjectsModel[]> =
        await this.fetchGeneralSubjectsUseCase.call(params);
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
