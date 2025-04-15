import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/assets/images/Rectangle.png";
import successImage from "~/assets/images/Rectangle2.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
// import type UserModel from "../../Data/models/education_stages_model";
import EducationStagesUseCase from "../../Domain/use_case/education_stages_use_case";
import type TitleModel from "~/base/core/Models/title_model";

export default class EducationStagesController extends ControllerInterface<TitleModel[]> {
  private static instance: EducationStagesController;
  private constructor() {
    super();
  }
  private educationStagesUseCase = new EducationStagesUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new EducationStagesController();
    }
    return this.instance;
  }

  async FetchEducationStages(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<TitleModel[]> =
        await this.educationStagesUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: "dialog",
        //   titleContent: "Vote Success",
        //   imageElement: successImage,
        //   messageContent: null,
        // });
        // await FetchMyReviewsController.getInstance().fetchMyReviews(
        //   new FetchMyReviewParams(1, 10),
        // );
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


