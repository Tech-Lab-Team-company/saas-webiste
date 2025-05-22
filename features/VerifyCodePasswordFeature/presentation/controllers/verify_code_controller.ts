import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/VerifyCodePasswordFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import VerifyCodePasswordUseCase from "~/features/VerifyCodePasswordFeature/Domain/use_case/verify_code_password_use_case";
import VerifyCodeParams from "~/features/VerifyCodeFeature/Core/Params/verfiy_code_params";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import EmailBuilder from "~/features/VerifyCodeFeature/presentation/builder/email_builder";

export default class VerifyCodePasswordController extends ControllerInterface<UserModel> {
  private static instance: VerifyCodePasswordController;
  private constructor() {
    super();
  }
  private VerifyCodePasswordUseCase = new VerifyCodePasswordUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new VerifyCodePasswordController();
    }
    return this.instance;
  }

  async VerifyCodePassword(params: VerifyCodeParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const router = useRouter();
      const dataState: DataState<UserModel> =
        await this.VerifyCodePasswordUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Verify Code Success",
          imageElement: successImage,
          messageContent: null,
        });

        // EmailBuilder.Instance.setEmail(params.email);

        // console.log(EmailBuilder.Instance.build())


        await router.push("/auth/set-password");
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
