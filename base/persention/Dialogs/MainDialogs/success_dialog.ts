import DialogService from '~/base/persention/Dialogs/dialog_service'

export default class ShowSuccessDialog extends DialogService {
  private static _instance: ShowSuccessDialog
  constructor() {
    super()
  }

  static get Instance() {
    if (!this._instance) {
      this._instance = new ShowSuccessDialog()
    }
    return this._instance
  }
}
