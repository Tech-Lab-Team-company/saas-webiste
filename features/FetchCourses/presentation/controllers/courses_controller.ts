import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import type CoursesModel from "../../Data/models/courses_model";
import CoursesUseCase from "../../Domain/use_case/courses_use_case";

export default class CoursesController extends ControllerInterface<CoursesModel[]> {
  private static instance: CoursesController;
  private constructor() {
    super();
  }
  private coursesUseCase = new CoursesUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new CoursesController();
    }
    return this.instance;
  }

  async FetchCourses(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<CoursesModel[]> =
        await this.coursesUseCase.call(params);
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
      // DialogSelector.instance.errorDialog.openDialog({
      //   dialogName: "dialog",
      //   titleContent: error,
      //   imageElement: errorImage,
      //   messageContent: null,
      // });
      // console.log("Error in FetchCourses: ", error);
      return this.state;
    }
    return this.state;
  }
}


