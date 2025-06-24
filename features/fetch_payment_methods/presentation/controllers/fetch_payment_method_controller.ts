import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
// import type UserModel from "../../Data/models/education_stages_model";
import type PaymentMethodModel from "../../Data/models/fetch_payment_method_model";
import FetchPaymentMethodUseCase from "../../Domain/use_case/fetch_payment_method_use_case";

export default class FetchPaymentMethodController extends ControllerInterface<PaymentMethodModel> {
  private static instance: FetchPaymentMethodController;
  private constructor() {
    super();
  }
  private fetchPaymentMethodUseCase = new FetchPaymentMethodUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchPaymentMethodController();
    }
    return this.instance;
  }

  async FetchPaymentMthod(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<PaymentMethodModel> =
        await this.fetchPaymentMethodUseCase.call(params);
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
      // DialogSelector.instance.errorDialog.openDialog({
      //   dialogName: "dialog",
      //   titleContent: error,
      //   imageElement: errorImage,
      //   messageContent: null,
      // });
      return this.state;
    }
    return this.state;
  }
}


