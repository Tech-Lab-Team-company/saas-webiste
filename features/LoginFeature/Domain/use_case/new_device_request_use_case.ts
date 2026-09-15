import type Params from '~/base/core/Params/params'
import type UserModel from '~/features/LoginFeature/Data/models/user_model'
import type UseCase from '~/base/Domain/UseCase/use_case'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import { NewDeviceRequestRepo } from '../repositories/new_device_request'

export default class NewDeviceRequestUseCase implements UseCase<UserModel, Params> {
  async call(params: Params): Promise<DataState<UserModel>> {
    console.log('NewDeviceRequestUseCase called with params:', params)
    return NewDeviceRequestRepo.getInstance().call(params)
  }
}
