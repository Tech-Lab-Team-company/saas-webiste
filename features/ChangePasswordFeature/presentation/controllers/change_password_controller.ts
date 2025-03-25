import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/ChangePasswordFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import ChangePasswordUseCase from "~/features/ChangePasswordFeature/Domain/use_case/change_password_use_case";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class ChangePasswordController extends ControllerInterface<UserModel> {
  private static instance: ChangePasswordController;
  private constructor() {
    super();
  }
  private ChangePasswordUseCase = new ChangePasswordUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangePasswordController();
    }
    return this.instance;
  }

  async changePassword(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<UserModel> =
        await this.ChangePasswordUseCase.call(params);
      console.log(dataState)
      this.setState(dataState);

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Change Password Success",
          imageElement: successImage,
          messageContent: null,
        });
      }else {
        console.log(this.state.value.error)
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
