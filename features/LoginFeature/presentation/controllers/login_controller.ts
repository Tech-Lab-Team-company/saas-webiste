import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/LoginFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import LoginUseCase from "~/features/LoginFeature/Domain/use_case/login_use_case";
import { useUserStore } from "~/stores/user";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import LoginParams from "~/features/LoginFeature/Core/Params/login_params";
import { consumeAuthRedirect } from "~/utils/authRedirect";
import { ErrorType } from "~/base/core/networkStructure/Resources/errors/errorModel";
import { markUserOnline } from "~/utils/onlineStatusTracking";

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

  async login(
    params: LoginParams,
    router: any,
  ): Promise<boolean> {
    try {
      const dataState: DataState<UserModel> =
        await this.LoginUseCase.call(params);

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

          void markUserOnline();

          const redirect = consumeAuthRedirect(
            router.currentRoute.value.query.redirect,
          );

          await router.replace(
            redirect || "/student-dashboard",
          );
        }

        return true;
      }

      const error = this.state.value.error;
      console.log("error", error);

      const isUnauthorized =
        error?.type === ErrorType.unknown;

      const message = isUnauthorized
        ? LOGIN_UNAUTHORIZED_MESSAGE
        : error?.title ||
        "تعذر تسجيل الدخول. حاول مرة أخرى.";

      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: message,
        imageElement: errorImage,
        messageContent: isUnauthorized
          ? "هذا الجهاز غير مسجل للدخول."
          : null,
        autoCloseMs: isUnauthorized ? 0 : 6500,

        action: isUnauthorized
          ? {
            label: "إرسال طلب جهاز",

            callback: () => {
              // اقفل Dialog الخطأ
              DialogSelector.instance.errorDialog.closeDialog(
                "dialog",
              );

              // افتح Dialog طلب الجهاز
              requestAnimationFrame(() => {
                DialogSelector.instance.newDeviceRequestDialog.openDialog(
                  {
                    dialogName: "new-device-request-dialog",
                    titleContent: "طلب تسجيل جهاز جديد",
                    messageContent: "برجاء إدخال البيانات لإرسال طلب تسجيل الجهاز.",
                    imageElement: null,
                    autoCloseMs: 0,
                    action: null,
                  }
                );
              });
            },
          }
          : null,
      });

      return false;
    } catch (error: any) {
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent:
          error?.message ||
          "تعذر تسجيل الدخول. حاول مرة أخرى.",
        imageElement: errorImage,
        messageContent: null,
        autoCloseMs: 6500,
        action: null,
      });

      return false;
    }
  }
}