import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CommentModel from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import ReportReviewsUseCase from "~/features/ReportReviewFeature/Domain/use_case/report_review_use_case";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import FetchMyReviewsController from "~/features/FetchReviewsFeature/presentation/controllers/fetch_my_reviews_controller";
import FetchMyReviewParams from "~/features/FetchReviewsFeature/Core/Params/fetch_my_reviews_params";

export default class ReportReviewsController extends ControllerInterface<CommentModel> {
  private static instance: ReportReviewsController;
  private constructor() {
    super();
  }
  private ReportReviewsUseCase = new ReportReviewsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ReportReviewsController();
    }
    return this.instance;
  }

  async reportReview(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CommentModel> =
        await this.ReportReviewsUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Report Success",
          imageElement: successImage,
          messageContent: null,
        });
        await FetchMyReviewsController.getInstance().fetchMyReviews(
          new FetchMyReviewParams(1, 10),
        );
      } else {
        throw new Error(this.state.value.error?.title);
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: error,
        imageElement: errorImage,
        messageContent: null,
      });
    }
  }
}
