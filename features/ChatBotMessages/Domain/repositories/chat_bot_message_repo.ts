import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { ChatBotMessagesApiService } from "../../Data/api_services/chat_bot_message_api_service";
import ChatBotMessagesModel from "../../Data/models/chat_bot_messages_model";

class ChatBotMessageRepo extends RepoInterface<String> {
  private static instance: ChatBotMessageRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChatBotMessageRepo();
    }
    return this.instance;
  }

  onParse(data: any): String {
    return String(data);
    }

  get serviceInstance(): ServicesInterface {
    return ChatBotMessagesApiService.getInstance();
  }
}

export { ChatBotMessageRepo };
