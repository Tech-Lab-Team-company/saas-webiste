import type Params from "~/base/core/Params/params";
import type UseCase from "~/base/Domain/UseCase/use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import { FetchMessageRepo } from "~/features/ChatFeature/Domain/repositories/fetch_message_repo";
import type MessageModel from "../../Data/models/message_model";

export default class FetchMessageUseCase implements UseCase<MessageModel[], Params> {
  async call(params: Params): Promise<DataState<MessageModel[]>> {
    return FetchMessageRepo.getInstance().call(params);
  }
}
