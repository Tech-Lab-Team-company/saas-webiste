import { ApiNames } from '~/base/core/networkStructure/apiNames'
import ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import { CrudType } from '~/base/core/Params/call_params_interface'
import type Params from '~/base/core/Params/params'

class FetchChatBotApiService extends ServicesInterface {
  private static instance: FetchChatBotApiService
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchChatBotApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    
    return await super.call({
      url: ApiNames.Instance.fetchchatbot,
      type: CrudType.POST,
      params: params,
      headers: {
        'web-domain': 'student',
      },
    })
  }
}

export { FetchChatBotApiService }
