import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CommentModel from "~/features/FetchReviewsFeature/Data/models/my_review_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import DeleteReviewsUseCase from "~/features/DeleteReviewFeature/Domain/use_case/delete_review_use_case";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import FetchMyReviewsController from "~/features/FetchReviewsFeature/presentation/controllers/fetch_my_reviews_controller";
import FetchMyReviewParams from "~/features/FetchReviewsFeature/Core/Params/fetch_my_reviews_params";

export default class DeleteReviewsController extends ControllerInterface<CommentModel> {
  private static instance: DeleteReviewsController;
  private constructor() {
    super();
  }
  private DeleteReviewsUseCase = new DeleteReviewsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteReviewsController();
    }
    return this.instance;
  }

  async deleteReview(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CommentModel> =
        await this.DeleteReviewsUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Delete Success",
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
