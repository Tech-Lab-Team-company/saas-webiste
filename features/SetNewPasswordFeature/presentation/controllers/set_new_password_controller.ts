import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import SetNewPasswordModel from "~/features/ResetPasswordFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import SetNewPasswordUseCase from "~/features/SetNewPasswordFeature/Domain/use_case/set_new_password_case";
import SetNewPasswordParams from "~/features/ResetPasswordFeature/Core/Params/sent_code_params";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";

// import ResetPasswordBuilder from "~/features/ResetPasswordFeature/presentation/builders/reset_password_builder";
export default class SetNewPasswordController extends ControllerInterface<SetNewPasswordModel> {
  private static instance: SetNewPasswordController;
  private constructor() {
    super();
  }
  private SetNewPasswordUseCase = new SetNewPasswordUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new SetNewPasswordController();
    }
    return this.instance;
  }

  async setNewPassword(params: SetNewPasswordParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<SetNewPasswordModel> =
        await this.SetNewPasswordUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Verify Code Success",
          imageElement: successImage,
          messageContent: null,
        });
        await router.replace("/login");
        // if (this.state.value.data?.email) {
        //   ResetPasswordBuilder.Instance.setEmail(this.state.value.data?.email);
        // }
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
