import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import errorImage from "~/public/images/error.png";
import successImage from "~/public/images/success-dialog.png";
import type ScanCodeParams from "~/features/ScanCode/Core/Params/scan_code_params";
import ScanCodeUseCase from "~/features/ScanCode/Domain/use_case/scan_code_use_case";

export default class ScanCodeController extends ControllerInterface<
  Record<string, unknown>
> {
  private static instance: ScanCodeController;
  private readonly scanCodeUseCase = new ScanCodeUseCase();

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) this.instance = new ScanCodeController();
    return this.instance;
  }

  async scanCode(params: ScanCodeParams): Promise<boolean> {
    this.setLoading();
    const dataState = await this.scanCodeUseCase.call(params);
    this.setState(dataState);

    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: "dialog",
        titleContent: dataState.message || "تم تفعيل الكود بنجاح",
        imageElement: successImage,
        messageContent: "يمكنك الآن الوصول إلى المحتوى المرتبط بالكود.",
      });
      return true;
    }

    DialogSelector.instance.errorDialog.openDialog({
      dialogName: "dialog",
      titleContent: dataState.error?.title || "تعذر تفعيل الكود",
      imageElement: errorImage,
      messageContent: "تأكد من كتابة الكود بشكل صحيح، ثم حاول مرة أخرى.",
    });
    return false;
  }
}
