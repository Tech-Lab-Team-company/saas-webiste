import { ControllerInterface } from '@/base/persention/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/Params/params'
import type CoursePaymentModel from '../../Data/models/course_payment_model';
import CoursesPaymentUseCase from '../../Domain/use_case/courses_payment_use_case';
import DialogSelector from '~/base/persention/Dialogs/dialog_selector';
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";

export default class CoursesPaymentController extends ControllerInterface<CoursePaymentModel> {
  private static instance: CoursesPaymentController
  private constructor() {
    super()
  }
  private coursesPaymentUseCase = new CoursesPaymentUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CoursesPaymentController()
    }
    return this.instance
  }

  async CoursesPayment(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params, "params")
    try {
      const dataState: DataState<CoursePaymentModel> = await this.coursesPaymentUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "تم ارسال الطلب ",
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
