import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { SentMessageRepo } from "~/features/ChatFeature/Domain/repositories/sent_message_repo";
import type MessageModel from "../../Data/models/message_model";

export default class SentMessageUseCase implements UseCase<MessageModel[], Params> {
  async call(params: Params): Promise<DataState<MessageModel[]>> {
    return SentMessageRepo.getInstance().call(params);
  }
}
