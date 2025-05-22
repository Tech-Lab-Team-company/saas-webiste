import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import SentMessageUseCase from "~/features/ChatFeature/Domain/use_case/sent_message_use_case";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import MessageModel from "../../Data/models/message_model";

export default class SentMessageController extends ControllerInterface<MessageModel[]> {
  private static instance: SentMessageController;
  private constructor() {
    super();
  }
  private SentMessageUseCase = new SentMessageUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new SentMessageController();
    }
    return this.instance;
  }

  async SentMessage(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<MessageModel[]> =
        await this.SentMessageUseCase.call(params);
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
