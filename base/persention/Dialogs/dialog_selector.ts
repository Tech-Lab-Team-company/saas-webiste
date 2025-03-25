import ShowSuccessDialog from '~/base/persention/Dialogs/MainDialogs/success_dialog'
import ShowErrorDialog from "~/base/persention/Dialogs/MainDialogs/error_dialog";

export default class DialogSelector {
  private static _instance: DialogSelector
  private constructor() {}
  static get instance() {
    if (!DialogSelector._instance) {
      DialogSelector._instance = new DialogSelector()
    }
    return DialogSelector._instance
  }

  public successDialog: ShowSuccessDialog = ShowSuccessDialog.Instance
  public errorDialog: ShowSuccessDialog = ShowErrorDialog.Instance
}