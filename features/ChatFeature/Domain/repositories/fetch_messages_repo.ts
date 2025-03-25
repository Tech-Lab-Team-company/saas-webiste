import { FetchMessagesApiService } from '~/features/ChatFeature/Data/api_services/fetch_messages_api_service'
import RepoInterface  from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import ChatUsersModel from '../../Data/models/chat_users_model'


class FetchMessagesRepo extends RepoInterface<ChatUsersModel[]> {
  private static instance: FetchMessagesRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMessagesRepo()
    }
    return this.instance
  }

  onParse(data: any): ChatUsersModel[] {
    return data.map((item: any) => ChatUsersModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return FetchMessagesApiService.getInstance();
  }
}

export { FetchMessagesRepo }
