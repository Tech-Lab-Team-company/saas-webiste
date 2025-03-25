import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/LoginFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import UpdateProfileUseCase from "~/features/UpdateProfileFeature/Domain/use_case/update_profile_use_case";
import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class UpdateProfileController extends ControllerInterface<UserModel> {
  private static instance: UpdateProfileController;
  private constructor() {
    super();
  }
  private UpdateProfileUseCase = new UpdateProfileUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateProfileController();
    }
    return this.instance;
  }

  async updateProfile(params: Params, ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<UserModel> =
        await this.UpdateProfileUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "UpdateProfile Success",
          imageElement: successImage,
          messageContent: null,
        });
        const userStore = useUserStore();
        if (this.state.value.data && this.state.value.data) {
          const user = useUserStore().user;
          if (user) {
            user.firstName = this.state.value.data.firstName;
            user.lastName = this.state.value.data.lastName;
            user.email = this.state.value.data.email;
            user.phone = this.state.value.data.phone;
            user.name = this.state.value.data.name;
            user.aboutMe = this.state.value.data.aboutMe;
            user.sendNotifications = this.state.value.data.sendNotifications;
            user.facebook = this.state.value.data.facebook;
            user.x = this.state.value.data.x;
            user.instagram = this.state.value.data.instagram;
            user.youtube = this.state.value.data.youtube;
            user.linkedin = this.state.value.data.linkedin;
            user.whatsapp = this.state.value.data.whatsapp;
          }
        }
      }else {
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
