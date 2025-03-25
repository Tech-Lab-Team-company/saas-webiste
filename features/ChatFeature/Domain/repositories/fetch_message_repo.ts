import { FetchMessageApiService } from '~/features/ChatFeature/Data/api_services/fetch_message_api_service'
import RepoInterface, {ResponseType} from '~/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import  MessageModel from '../../Data/models/message_model'


class FetchMessageRepo extends RepoInterface<MessageModel[]> {
  private static instance: FetchMessageRepo
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMessageRepo()
    }
    return this.instance
  }



  onParse(data: any): MessageModel[] {
    return data.map((item: any) => MessageModel.fromMap(item) );
  }

  get serviceInstance(): ServicesInterface {
    return FetchMessageApiService.getInstance();
  }
}

export { FetchMessageRepo }
