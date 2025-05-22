import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CommentModel from "~/features/EditRateFeature/Data/models/comment_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import EditRateUseCase from "~/features/EditRateFeature/Domain/use_case/edit_rate_use_case";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class EditRateController extends ControllerInterface<CommentModel> {
  private static instance: EditRateController;
  private constructor() {
    super();
  }
  private EditRateUseCase = new EditRateUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditRateController();
    }
    return this.instance;
  }

  async editRate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CommentModel> =
        await this.EditRateUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "EditRate Success",
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
