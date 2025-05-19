import { ControllerInterface } from '@/base/persention/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/Params/params'
import successImage from "@/assets/images/success-dialog.png";
import errorImage from "@/assets/images/error.png";
import DialogSelector from '@/base/persention/Dialogs/dialog_selector';
import CoursesFilterModel from '../../Data/models/courses_filter_model';
import CoursesFilterUseCase from '../../Domain/use_case/courses_filter_use_case';

export default class CoursesFilterController extends ControllerInterface<CoursesFilterModel[]> {
  private static instance: CoursesFilterController
  private constructor() {
    super()
  }
  private coursesFilterUseCase = new CoursesFilterUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CoursesFilterController()
    }
    return this.instance
  }

  async CoursesFilter(params: Params) {
    // useLoaderStore().setLoadingWithDialog();

    try {
      const dataState: DataState<CoursesFilterModel[]> = await this.coursesFilterUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        console.log("before success")
    //     DialogSelector.instance.successDialog.openDialog({
    //   dialogName: "dialog",
    //       titleContent: "Added was successful",
    //       imageElement: successImage,
    //       messageContent: null,
    //     })
        // useLoaderStore().endLoadingWithDialog();
      } else {
        // DialogSelector.instance.failedDialog.openDialog({
        //   dialogName: "dialog",
        //   titleContent: this.state.value.error?.title ?? "Ann Error Occurred",
        //   imageElement: errorImage,
        //   messageContent: null,
        // });
      }
    } catch (error: any) {
    //   DialogSelector.instance.failedDialog.openDialog({
    //     dialogName: "dialog",
    //     titleContent: this.state.value.error?.title,
    //     imageElement: errorImage,
    //     messageContent: null,
    //   });
    }

    super.handleResponseDialogs()
    return this.state
  }
}
