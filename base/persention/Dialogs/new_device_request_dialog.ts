import DialogService from '~/base/persention/Dialogs/dialog_service'

export default class NewDeviceRequestDialog extends DialogService {
  private static _instance: NewDeviceRequestDialog

  constructor() {
    super()
  }

  static get Instance() {
    if (!this._instance) {
      this._instance = new NewDeviceRequestDialog()
    }

    return this._instance
  }
}