import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import OnlinePaymentUseCase from "../../Domain/use_case/online_payment_use_case";
import type OnlinePaymentModel from "../../Data/models/online_payment_model";

export default class OnlinePaymentController extends ControllerInterface<OnlinePaymentModel> {
  private static instance: OnlinePaymentController;
  private constructor() {
    super();
  }
  private OnlinePaymentUseCase = new OnlinePaymentUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new OnlinePaymentController();
    }
    return this.instance;
  }

  async CreateOnlinePayment(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<OnlinePaymentModel> =
        await this.OnlinePaymentUseCase.call(params);
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
      // console.log("Error in FetchOnlinePayment: ", error);
      return this.state;
    }
    return this.state;
  }
}
