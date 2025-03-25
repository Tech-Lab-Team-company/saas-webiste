import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchMessagesRepo } from "~/features/ChatFeature/Domain/repositories/fetch_messages_repo";
import type ChatUsersModel from "../../Data/models/chat_users_model";

export default class FetchMessagesUseCase implements UseCase<ChatUsersModel[], Params> {
  async call(params: Params): Promise<DataState<ChatUsersModel[]>> {
    return FetchMessagesRepo.getInstance().call(params);
  }
}
