import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import SentCodeModel from "~/features/ResetPasswordFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import SentCodeUseCase from "~/features/ResetPasswordFeature/Domain/use_case/sent_code_case";
import errorImage from "~/public/images/error.png";
import SentCodeParams from "~/features/ResetPasswordFeature/Core/Params/sent_code_params";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import ResetPasswordBuilder from "~/features/ResetPasswordFeature/presentation/builders/reset_password_builder";
import successImage from "~/public/images/success-dialog.png";

export default class SentCodeController extends ControllerInterface<SentCodeModel> {
  private static instance: SentCodeController;
  private constructor() {
    super();
  }
  private SentCodeUseCase = new SentCodeUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new SentCodeController();
    }
    return this.instance;
  }

  async sentCode(params: SentCodeParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<SentCodeModel> =
        await this.SentCodeUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        ResetPasswordBuilder.Instance.setEmail(params.phone);
        await router.replace("/login/verifycode");
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
