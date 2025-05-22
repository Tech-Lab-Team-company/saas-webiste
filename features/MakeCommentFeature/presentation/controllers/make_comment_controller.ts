import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CommentModel from "~/features/MakeCommentFeature/Data/models/comment_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import MakeCommentUseCase from "~/features/MakeCommentFeature/Domain/use_case/make_comment_use_case";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import FetchCommentsController from "~/features/FetchCommentsFeature/presentation/controllers/fetch_comments_controller";
import MakeCommentParams from "~/features/MakeCommentFeature/Core/Params/make_comment_params";
import FetchCommentParams from "~/features/FetchCommentsFeature/Core/Params/fetch_comment_params";

export default class MakeCommentController extends ControllerInterface<CommentModel> {
  private static instance: MakeCommentController;
  private constructor() {
    super();
  }
  private MakeCommentUseCase = new MakeCommentUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new MakeCommentController();
    }
    return this.instance;
  }

  async makeComment(params: Params | MakeCommentParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CommentModel> =
        await this.MakeCommentUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "MakeComment Success",
          imageElement: successImage,
          messageContent: null,
        });

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
