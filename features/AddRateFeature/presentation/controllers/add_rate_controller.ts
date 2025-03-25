import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CommentModel from "~/features/AddRateFeature/Data/models/comment_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import AddRateUseCase from "~/features/AddRateFeature/Domain/use_case/add_rate_use_case";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/rate-success.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class AddRateController extends ControllerInterface<CommentModel> {
  private static instance: AddRateController;
  private constructor() {
    super();
  }
  private AddRateUseCase = new AddRateUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddRateController();
    }
    return this.instance;
  }

  async addRate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CommentModel> =
        await this.AddRateUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "AddRate Success",
          imageElement: successImage,
          messageContent: null,
        });
        // console.log(this.state?.value?.data)
        
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: error,
        imageElement: errorImage,
        messageContent: null,
      });
    }
  }
}
