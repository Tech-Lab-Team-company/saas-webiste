import { ControllerInterface } from '~/base/persention/Controller/controller_interface'
import UserModel from '~/features/LoginFeature/Data/models/user_model'
import type { DataState } from '~/base/core/networkStructure/Resources/dataState/data_state'
import NewDeviceRequestUseCase from '../../Domain/use_case/new_device_request_use_case'
import type NewDeviceRequestParams from '../../Core/Params/new_device_request_params'
import DialogSelector from '~/base/persention/Dialogs/dialog_selector'
import errorImage from '~/public/images/error.png'
import successImage from '~/public/images/success-dialog.png'

export default class NewDeviceRequestController
  extends ControllerInterface<UserModel> {

  private static instance: NewDeviceRequestController

  private constructor() {
    super()
  }

  private NewDeviceRequestUseCase =
    new NewDeviceRequestUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance =
        new NewDeviceRequestController()
    }

    return this.instance
  }

  async requestNewDevice(
    params: NewDeviceRequestParams,
  ): Promise<boolean> {
    try {
      const dataState: DataState<UserModel> =
        await this.NewDeviceRequestUseCase.call(params)

      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'تم إرسال الطلب بنجاح',
          imageElement: successImage,
          messageContent:
            'سيتم مراجعة طلب تسجيل الجهاز.',
          autoCloseMs: 6500,
          action: null,
        })

        return true
      }

      throw new Error(
        this.state.value.error?.title ||
          'تعذر إرسال طلب تسجيل الجهاز',
      )
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: 'dialog',
        titleContent:
          error instanceof Error
            ? error.message
            : 'تعذر إرسال طلب تسجيل الجهاز',
        imageElement: errorImage,
        messageContent: null,
        autoCloseMs: 6500,
        action: null,
      })

      return false
    }
  }
}