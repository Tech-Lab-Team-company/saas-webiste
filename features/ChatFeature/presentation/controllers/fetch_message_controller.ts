import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchMessageUseCase from "~/features/ChatFeature/Domain/use_case/fetch_message_use_case";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import MessageModel from "../../Data/models/message_model";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
export default class FetchMessageController extends ControllerInterface<MessageModel[]> {
  private static instance: FetchMessageController;
  private constructor() {
    super();
  }
  private FetchMessageUseCase = new FetchMessageUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMessageController();
    }
    return this.instance;
  }

  async FetchMessage(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<MessageModel[]> =
        await this.FetchMessageUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        
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
