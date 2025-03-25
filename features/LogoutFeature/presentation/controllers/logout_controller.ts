import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/LogoutFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import LogoutUseCase from "~/features/LogoutFeature/Domain/use_case/logout_use_case";
import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class LogoutController extends ControllerInterface<UserModel> {
  private static instance: LogoutController;
  private constructor() {
    super();
  }
  private LogoutUseCase = new LogoutUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new LogoutController();
    }
    return this.instance;
  }

  async Logout(router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const router = useRouter();
      const dataState: DataState<UserModel> =
        await this.LogoutUseCase.call();
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Logout Success",
          imageElement: successImage,
          messageContent: null,
        });
        await router.push("/");
        const userStore = useUserStore();
        if (this.state.value.data) {
          userStore.logout();
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
