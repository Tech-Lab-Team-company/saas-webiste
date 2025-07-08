import { ApiNames } from '~/base/core/networkStructure/apiNames'
import ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import { CrudType } from '~/base/core/Params/call_params_interface'
import type Params from '~/base/core/Params/params'

class ChatBotMessagesApiService extends ServicesInterface {
  private static instance: ChatBotMessagesApiService
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChatBotMessagesApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    console.log(CrudType.POST)
    return await super.call({
      url: ApiNames.Instance.chatbotmessages,
      type: CrudType.POST,
      params: params,
      headers: {
        'web-domain': 'student.azcourses.tech',
      },
    })
  }
}

export { ChatBotMessagesApiService }
