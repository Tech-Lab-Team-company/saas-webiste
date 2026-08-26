import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/LoginFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import LoginUseCase from "~/features/LoginFeature/Domain/use_case/login_use_case";
import { useUserStore } from "~/stores/user";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import EmailBuilder from "~/features/VerifyCodeFeature/presentation/builder/email_builder";
import LoginParams from "~/features/LoginFeature/Core/Params/login_params";
import { consumeAuthRedirect } from "~/utils/authRedirect";
import { ErrorType } from "~/base/core/networkStructure/Resources/errors/errorModel";

const LOGIN_UNAUTHORIZED_MESSAGE =
  "ليس لديك حق تسجيل الدخول تواصل مع المسؤول";

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
  async login(params: LoginParams, router: any): Promise<boolean> {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<UserModel> = await this.LoginUseCase.call(
        params,
      );
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Login Success",
          imageElement: successImage,
          messageContent: null,
        });
        const userStore = useUserStore();
        if (this.state.value.data) {
          await userStore.setUser(this.state.value.data);
          const redirect = consumeAuthRedirect(
            router.currentRoute.value.query.redirect,
          );
          await router.replace(redirect || "/student-dashboard");
        }
        return true;
      } else {
        const error = this.state.value.error;
        const message =
          error?.type === ErrorType.unAuthorized
            ? LOGIN_UNAUTHORIZED_MESSAGE
            : error?.title || "تعذر تسجيل الدخول. حاول مرة أخرى.";

        DialogSelector.instance.errorDialog.openDialog({
          dialogName: "dialog",
          titleContent: message,
          imageElement: errorImage,
          messageContent: null,
        });
        return false;
      }
      // useLoaderStore().endLoadingWithDialog();
    } catch (error: any) {
      console.log("log in error", error);
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent:
          error instanceof Error ? error.message : "تعذر تسجيل الدخول. حاول مرة أخرى.",
        imageElement: errorImage,
        messageContent: null,
      });
      return false;
    }
    console.log(this.state.value);
  }
}
