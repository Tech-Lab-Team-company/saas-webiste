import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import DeleteRateImageUseCase from "~/features/EditRateFeature/Domain/use_case/delete_rate_image_use_case";
// import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import type RateDetailsModel from "~/features/EditRateFeature/Data/models/comment_model";

export default class DeleteRateImageController extends ControllerInterface<
  RateDetailsModel
> {
  private static instance: DeleteRateImageController;
  private constructor() {
    super();
  }
  private DeleteRateImageUseCase = new DeleteRateImageUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteRateImageController();
    }
    return this.instance;
  }

  async deleteRateImage(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const router = useRouter();
      const dataState: DataState<RateDetailsModel> =
        await this.DeleteRateImageUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "DeleteRateImage Success",
          imageElement: successImage,
          messageContent: null,
        });
        // await router.push("/");
        // const userStore = useUserStore();
        // if (this.state.value.data) {
        //   console.log(this.state.value.data)
        //   userStore.setUser(this.state.value.data);
        // }
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
