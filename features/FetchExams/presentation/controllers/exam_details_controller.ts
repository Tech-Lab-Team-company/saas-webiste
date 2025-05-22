import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
// import type UserModel from "../../Data/models/education_stages_model";
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
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<ExamDetailsModel> =
        await this.examDetailsUseCase.call(params);
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


