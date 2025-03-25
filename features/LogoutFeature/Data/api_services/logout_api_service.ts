import { ApiNames } from '~/base/core/networkStructure/apiNames'
import ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import { CrudType } from '~/base/core/Params/call_params_interface'
import type Params from '~/base/core/Params/params'

class LogoutApiService extends ServicesInterface {
  private static instance: LogoutApiService
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new LogoutApiService()
    }
    return this.instance
  }

  async applyService(): Promise<{ data: any; statusCode: number }> {
    console.log(CrudType.POST)
    return await super.call({
      url: ApiNames.Instance.logout,
      type: CrudType.POST,
      auth: true,
      showLoadingDialog: true,
    })
  }
}

export { LogoutApiService }
