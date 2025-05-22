import { ControllerInterface } from '@/base/persention/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/Params/params'
import DialogSelector from '~/base/persention/Dialogs/dialog_selector';
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import type SubmitHomeWorkModel from '../../Data/models/submit_homework_model';
import SubmitHomeworkUseCase from '../../Domain/use_case/submit_homework_use_case';

export default class SubmitHomeworkController extends ControllerInterface<SubmitHomeWorkModel> {
  private static instance: SubmitHomeworkController
  private constructor() {
    super()
  }
  private submitHomeworkUseCase = new SubmitHomeworkUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new SubmitHomeworkController()
    }
    return this.instance
  }

  async SubmitHomeWork(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params, "params")
    try {
      const dataState: DataState<SubmitHomeWorkModel> = await this.submitHomeworkUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        console.log("before success")
        DialogSelector.instance.successDialog.openDialog({
      dialogName: "dialog",
          titleContent: "Added was successful",
          imageElement: successImage,
          messageContent: null,
        })
        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.errorDialog.openDialog({
          dialogName: "dialog",
          titleContent: this.state.value.error?.title ?? "Ann Error Occurred",
          imageElement: errorImage,
          messageContent: null,
        });
      }
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: this.state.value.error?.title,
        imageElement: errorImage,
        messageContent: null,
      });
    }

    super.handleResponseDialogs()
    return this.state
  }
}
