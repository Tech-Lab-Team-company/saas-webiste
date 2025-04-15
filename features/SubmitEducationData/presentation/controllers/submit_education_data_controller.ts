import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import errorImage from "~/assets/images/Rectangle.png";
import successImage from "~/assets/images/Rectangle2.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
// import type UserModel from "../../Data/models/education_stages_model";
import EducationStagesUseCase from "../../Domain/use_case/submit_education_data_use_case";
import type TitleModel from "~/base/core/Models/title_model";
import CollegeDepartmentUseCase from "../../Domain/use_case/submit_education_data_use_case";
import CollegeDepartmentDivisionsUseCase from "../../Domain/use_case/submit_education_data_use_case";
import type UserModel from "../../Data/models/submit_education_data_model";
import SubmitEducationDataUseCase from "../../Domain/use_case/submit_education_data_use_case";

export default class SubmitEducationDataController extends ControllerInterface<UserModel> {
  private static instance: SubmitEducationDataController;
  private constructor() {
    super();
  }
  private submitEducationDataUseCase = new SubmitEducationDataUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new SubmitEducationDataController();
    }
    return this.instance;
  }

  async SubmitEducationData(params: Params) {
    const router = useRouter();
    // useLoaderStore().setLoadingWithDialog();
    try {
      this.setLoading();
      const dataState: DataState<UserModel> =
        await this.submitEducationDataUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: "dialog",
        //   titleContent: "Vote Success",
        //   imageElement: successImage,
        //   messageContent: null,
        // });
        // await FetchMyReviewsController.getInstance().fetchMyReviews(
        //   new FetchMyReviewParams(1, 10),
        // /Auth/categories
        await router.push("/auth/categories");

        // );
      } else {
        throw new Error(this.state.value.error?.title);
      }
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: error,
        imageElement: errorImage,
        messageContent: null,
      });
      return this.state;
    }
    return this.state;
  }
}


