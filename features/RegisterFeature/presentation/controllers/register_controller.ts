import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import UserModel from '~/features/LoginFeature/Data/models/user_model'
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import RegisterUseCase from "~/features/RegisterFeature/Domain/use_case/register_use_case";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import EmailBuilder from "~/features/VerifyCodeFeature/presentation/builder/email_builder";
import RegisterParams from "~/features/RegisterFeature/Core/Params/register_params";
import { useUserStore } from "~/stores/user";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
export default class RegisterController extends ControllerInterface<UserModel> {
  private static _instance: RegisterController;
  private constructor() {
    super();
  }
  private RegisterUseCase = new RegisterUseCase();

  static getInstance() {
    if (!this._instance) {
      this._instance = new RegisterController();
    }
    return this._instance;
  }

  async Register(params: RegisterParams, router: any) {
    try {
    
      const dataState: DataState<UserModel> =await this.RegisterUseCase.call(params);
  
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: " Success",
          imageElement: successImage,
          messageContent: null,
        });
        EmailBuilder.Instance.setEmail(params.phone);
        const userStore = useUserStore();
        if (this.state.value.data) {
          console.log(this.state.value.data);
          userStore.setUser(this.state.value.data);
          // router.push("/Auth/varifyotp");
        }
        const settingStore = useSettingStore();
        if(settingStore.setting?.whatsapp_otp_activation == 1){

          await router.push("/Auth/varifyotp");
        }
        else{
          await router.push("/Auth/education");
        }


      } else {
             DialogSelector.instance.errorDialog.openDialog({
            dialogName: "dialog",
            titleContent: this.state.value.error?.title,
            imageElement: errorImage,
            messageContent: null,
          });
        // throw new Error();
      }
      return this.state;
    } catch (error: any) {
      console.log(error);
      DialogSelector.instance.errorDialog.openDialog({
        dialogName: "dialog",
        titleContent: error,
        imageElement: errorImage,
        messageContent: null,
      });
    }
  }
}
