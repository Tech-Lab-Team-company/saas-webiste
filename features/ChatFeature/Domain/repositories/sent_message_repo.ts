import { SentMessageApiService } from '~/features/ChatFeature/Data/api_services/sent_message_api_service'
import RepoInterface,  {ResponseType} from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import  MessageModel from '../../Data/models/message_model'


class SentMessageRepo extends RepoInterface<MessageModel[]> {
  private static instance: SentMessageRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new SentMessageRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }



  onParse(data: any): MessageModel[] {
    return data.map((item: any) => MessageModel.fromMap(item) );
  }

  get serviceInstance(): ServicesInterface {
    return SentMessageApiService.getInstance();
  }
}

export { SentMessageRepo }
