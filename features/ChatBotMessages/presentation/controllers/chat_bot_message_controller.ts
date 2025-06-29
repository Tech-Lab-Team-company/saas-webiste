import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import ChatBotMessageUseCase from "../../Domain/use_case/chat_bot_message_use_case";
import type ChatBotMessagesModel from "../../Data/models/chat_bot_messages_model";

export default class ChatBotMessageController extends ControllerInterface<
    String
> {
  private static instance: ChatBotMessageController;
  private constructor() {
    super();
  }
  private chatBotMessageUseCase = new ChatBotMessageUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChatBotMessageController();
    }
    return this.instance;
  }

  async ChatBotsMessages(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<String> =
        await this.chatBotMessageUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        return this.state;
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      return this.state;
    }
  }
}
