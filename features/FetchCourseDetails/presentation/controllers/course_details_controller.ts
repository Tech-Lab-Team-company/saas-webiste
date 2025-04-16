import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/assets/images/Rectangle.png";
import successImage from "~/assets/images/Rectangle2.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
// import type UserModel from "../../Data/models/education_stages_model";
import CourseDetailsUseCase from "../../Domain/use_case/course_details_use_case";
import type CourseDetailsModel from "../../Data/models/course_details_model";

export default class CourseDetailsController extends ControllerInterface<CourseDetailsModel> {
  private static instance: CourseDetailsController;
  private constructor() {
    super();
  }
  private courseDetailsUseCase = new CourseDetailsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new CourseDetailsController();
    }
    return this.instance;
  }

  async FetchCourseDetails(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<CourseDetailsModel> =
        await this.courseDetailsUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: "dialog",
        //   titleContent: "Vote Success",
        //   imageElement: successImage,
        //   messageContent: null,
        // });
  
      } else {
        throw new Error(this.state.value.error?.title);
      }
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: error,
        imageElement: errorImage,
        messageContent: null,
      });
      return this.state;
    }
    return this.state;
  }
}


