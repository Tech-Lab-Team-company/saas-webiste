import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from "~/features/VerifyCodeFeature/Data/models/user_model";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import VerifyCodeUseCase from "~/features/VerifyCodeFeature/Domain/use_case/verify_code_use_case";
import { useUserStore } from "~/stores/user";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";

export default class VerifyCodeController extends ControllerInterface<UserModel> {
  private static instance: VerifyCodeController;
  private constructor() {
    super();
  }
  private VerifyCodeUseCase = new VerifyCodeUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new VerifyCodeController();
    }
    return this.instance;
  }

  async verifyCode(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const router = useRouter();
      const dataState: DataState<UserModel> =
        await this.VerifyCodeUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Verify Code Success",
          imageElement: successImage,
          messageContent: null,
        });
        if(params.toMap().type == "ResetPassword"){
          await router.push("/login/setnewpassword");
        }
        else{

          await router.push("/Auth/education");
        }
        const userStore = useUserStore();
        if (this.state.value.data) {
          // console.log(this.state.value.data)
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
