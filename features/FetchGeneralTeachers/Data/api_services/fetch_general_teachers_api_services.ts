import { ApiNames } from '~/base/core/networkStructure/apiNames'
import ServicesInterface from '~/base/Data/ApiService/api_service_interface'
import { CrudType } from '~/base/core/Params/call_params_interface'
import type Params from '~/base/core/Params/params'

class FetchGenralTeachersApiService extends ServicesInterface {
  private static instance: FetchGenralTeachersApiService
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchGenralTeachersApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {

    return await super.call({
      url: ApiNames.Instance.FetchGenralTeachers,
      type: CrudType.GET,
      auth: true,
      params: params,
      showLoadingDialog: true,
    })
  }
}

export { FetchGenralTeachersApiService }
