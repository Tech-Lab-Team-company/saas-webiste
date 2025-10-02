import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import VerifyPaymentUseCase from "../../Domain/use_case/verify_payment_use_case";
import type VerifyPaymentModel from "../../Data/models/verify_payment_model";

export default class VerifyPaymentController extends ControllerInterface<VerifyPaymentModel> {
  private static instance: VerifyPaymentController;
  private constructor() {
    super();
  }
  private VerifyPaymentUseCase = new VerifyPaymentUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new VerifyPaymentController();
    }
    return this.instance;
  }

  async CreateVerifyPayment(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<VerifyPaymentModel> =
        await this.VerifyPaymentUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: "dialog",
        //   titleContent: "Vote Success",
        //   imageElement: successImage,
        //   messageContent: null,
        // });
        // console.log("url", this.state.value.data?.url);
        //  window.open(this.state.value.data?.url , '_blank');
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
      // console.log("Error in FetchVerifyPayment: ", error);
      return this.state;
    }
    return this.state;
  }
}
