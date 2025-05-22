import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchMessagesUseCase from "~/features/ChatFeature/Domain/use_case/fetch_messages_use_case";
import type ChatUsersModel from "../../Data/models/chat_users_model";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";

export default class FetchMessagesController extends ControllerInterface<ChatUsersModel[]> {
  private static instance: FetchMessagesController;
  private constructor() {
    super();
  }
  private FetchMessagesUseCase = new FetchMessagesUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMessagesController();
    }
    return this.instance;
  }

  async fetchMessages(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {

      this.setLoading()

      const dataState: DataState<ChatUsersModel[]> =
        await this.FetchMessagesUseCase.call(params);
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
      console.log(error);
    }
  }
}
