import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/LoginFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import LoginUseCase from "~/features/LoginFeature/Domain/use_case/login_use_case";
import { useUserStore } from "~/stores/user";
import errorImage from "~/assets/images/error.png";
import successImage from "~/assets/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import EmailBuilder from "~/features/VerifyCodeFeature/presentation/builder/email_builder";
import LoginParams from "~/features/LoginFeature/Core/Params/login_params";

export default class LoginController extends ControllerInterface<UserModel> {
  private static instance: LoginController;
  private constructor() {
    super();
  }
  private LoginUseCase = new LoginUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new LoginController();
    }
    return this.instance;
  }
Listin
  async login(params: LoginParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const router = useRouter();
      const dataState: DataState<UserModel> =
        await this.LoginUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        if (!this.state.value.data?.isVerified) {
          EmailBuilder.Instance.setEmail(params.credential);

          await router.push("/auth/verify-email");
        } else {

          DialogSelector.instance.successDialog.openDialog({
            dialogName: "dialog",
            titleContent: "Login Success",
            imageElement: successImage,
            messageContent: null,
          });
          await router.push("/");
          const userStore = useUserStore();
          if (this.state.value.data) {
            console.log(this.state.value.data)
            userStore.setUser(this.state.value.data);
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
