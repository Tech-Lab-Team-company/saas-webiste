import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchChatBotUseCase from "../../Domain/use_case/fetch_chat_bot_use_case";
import type ChatBotModel from "../../Data/models/chat_bot_model";

export default class FetchChatBotController extends ControllerInterface<
    ChatBotModel[]
> {
  private static instance: FetchChatBotController;
  private constructor() {
    super();
  }
  private fetchChatBotUseCase = new FetchChatBotUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchChatBotController();
    }
    return this.instance;
  }

  async fetchChatBots(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<ChatBotModel[]> =
        await this.fetchChatBotUseCase.call(params);
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
