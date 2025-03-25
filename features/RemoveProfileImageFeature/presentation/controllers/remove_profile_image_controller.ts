import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/RemoveProfileImageFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import RemoveProfileImageUseCase from "~/features/RemoveProfileImageFeature/Domain/use_case/remove_profile_image_use_case";
import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class RemoveProfileImageController extends ControllerInterface<UserModel> {
  private static instance: RemoveProfileImageController;
  private constructor() {
    super();
  }
  private RemoveProfileImageUseCase = new RemoveProfileImageUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new RemoveProfileImageController();
    }
    return this.instance;
  }

  async removeProfileImage() {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<UserModel> =
        await this.RemoveProfileImageUseCase.call();
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "RemoveProfileImage Success",
          imageElement: successImage,
          messageContent: null,
        });
        const userStore = useUserStore();
        if (this.state.value.data) {
          console.log(this.state.value.data);
          userStore.setUser(this.state.value.data);
        }
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
