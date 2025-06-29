import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { ChatBotMessageRepo } from "../repositories/chat_bot_message_repo";
import type ChatBotMessagesModel from "../../Data/models/chat_bot_messages_model";

export default class ChatBotMessageUseCase
  implements UseCase<String, Params>
{
  async call(params: Params): Promise<DataState<String>> {
    return ChatBotMessageRepo.getInstance().call(params);
  }
}
