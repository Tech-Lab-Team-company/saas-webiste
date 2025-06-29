import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type ChatBotModel from "../../Data/models/chat_bot_model";
import { FetchChatBotRepo } from "../repositories/fetch_chat_bot_repo";

export default class FetchChatBotUseCase
  implements UseCase<ChatBotModel[], Params>
{
  async call(params: Params): Promise<DataState<ChatBotModel[]>> {
    return FetchChatBotRepo.getInstance().call(params);
  }
}
