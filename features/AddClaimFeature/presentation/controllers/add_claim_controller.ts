import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import CommentModel from "~/features/AddClaimFeature/Data/models/comment_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import AddClaimUseCase from "~/features/AddClaimFeature/Domain/use_case/add_claim_use_case";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
// import FetchCommentsController from "~/features/FetchCommentsFeature/presentation/controllers/fetch_comments_controller";
// import AddClaimParams from "~/features/AddClaimFeature/Core/Params/add_claim_params";
// import FetchCommentParams from "~/features/FetchCommentsFeature/Core/Params/fetch_comment_params";

export default class AddClaimController extends ControllerInterface<CommentModel> {
  private static instance: AddClaimController;
  private constructor() {
    super();
  }
  private AddClaimUseCase = new AddClaimUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddClaimController();
    }
    return this.instance;
  }

  async addClaim(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CommentModel> =
        await this.AddClaimUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "AddClaim Success",
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
