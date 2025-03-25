import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/UpdateProfileImageFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import UpdateProfileImageUseCase from "~/features/UpdateProfileImageFeature/Domain/use_case/update_profile_image_use_case";
import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class UpdateProfileImageController extends ControllerInterface<UserModel> {
  private static instance: UpdateProfileImageController;
  private constructor() {
    super();
  }
  private UpdateProfileImageUseCase = new UpdateProfileImageUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateProfileImageController();
    }
    return this.instance;
  }

  async updateProfileImage(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<UserModel> =
        await this.UpdateProfileImageUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Update Profile Image Success",
          imageElement: successImage,
          messageContent: null,
        });
        const userStore = useUserStore();
        if (this.state.value.data) {
          // console.log(this.state.value.data);
          // userStore.setUser(this.state.value.data);
          const user = useUserStore().user;
          if (user) {
            user.image = this.state.value.data.image;

            // console.log(this.state.value.data)
          }
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
