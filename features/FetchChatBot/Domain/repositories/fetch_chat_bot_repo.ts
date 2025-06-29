import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import ChatBotModel from "../../Data/models/chat_bot_model";
import { FetchChatBotApiService } from "../../Data/api_services/fetch_chat_bot_api_service";

class FetchChatBotRepo extends RepoInterface<ChatBotModel[]> {
  private static instance: FetchChatBotRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchChatBotRepo();
    }
    return this.instance;
  }

  onParse(data: any): ChatBotModel[] {
    return data.map((item: any) => ChatBotModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchChatBotApiService.getInstance();
  }
}

export { FetchChatBotRepo };
