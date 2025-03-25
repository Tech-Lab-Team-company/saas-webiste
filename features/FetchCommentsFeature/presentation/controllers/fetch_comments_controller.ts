import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CommentModel from "~/features/FetchCommentsFeature/Data/models/comment_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import FetchCommentsUseCase from "~/features/FetchCommentsFeature/Domain/use_case/fetch_comments_use_case";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class FetchCommentsController extends ControllerInterface<CommentModel> {
  private static instance: FetchCommentsController;
  private constructor() {
    super();
  }
  private FetchCommentsUseCase = new FetchCommentsUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchCommentsController();
    }
    return this.instance;
  }

  async fetchComments(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CommentModel> =
        await this.FetchCommentsUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        return this.state;
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
