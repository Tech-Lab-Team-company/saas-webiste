import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import ContactUsUseCase from "~/features/ContactUsFeature/Domain/use_case/contact_us_use_case";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import ContactUsModel from "~/features/ContactUsFeature/Data/models/contact_us_model";

export default class ContactUsController extends ControllerInterface<ContactUsModel> {
  private static instance: ContactUsController;
  private constructor() {
    super();
  }
  private ContactUsUseCase = new ContactUsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ContactUsController();
    }
    return this.instance;
  }

  async contactUs(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<ContactUsModel> =
        await this.ContactUsUseCase.call(params);
      // console.log(dataState);
      this.setState(dataState);
      // console.log(this.state.value);

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        });
      } else {
        console.log(this.state.value.error);
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: error,
        imageElement: "",
        messageContent: null,
      });
    }
  }
}
