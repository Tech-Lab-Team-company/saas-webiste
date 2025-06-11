import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/FetchListingFeature/Data/models/listing_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchListingUseCase from "~/features/FetchListingFeature/Domain/use_case/fetch_listings_use_case";
import ListingModel from "~/features/FetchListingFeature/Data/models/listing_model";
import type GeneralCoursesModel from "../../Data/models/general_course_subjects_model";
import FetchGeneralCoursesSubjectsUseCase from "../../Domain/use_case/fetch_general_course_subjects_use_case";

export default class FetchGeneralCoursesSubjectController extends ControllerInterface<
  GeneralCoursesModel[]
> {
  private static instance: FetchGeneralCoursesSubjectController;
  private constructor() {
    super();
  }
  private fetchGeneralCoursesSubjectsUseCase = new FetchGeneralCoursesSubjectsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchGeneralCoursesSubjectController();
    }
    return this.instance;
  }

  async fetchGeneralCoursesSubject(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<GeneralCoursesModel[]> =
        await this.fetchGeneralCoursesSubjectsUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        return this.state;
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      
    }
    console.log(this.state.value.data,"this.state")
    return this.state;
  }
}
