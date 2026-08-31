import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import QuestionBankUseCase from "../../Domain/use_case/index_question_banks_use_case";
import type QuestionBankModel from "../../Data/models/question_banks_model";
import { ControllerInterface } from "~/base/persention/Controller/controller_interface";

export default class QuestionBankController extends ControllerInterface<QuestionBankModel[]> {
  private static instance: QuestionBankController;
  private constructor() {
    super();
  }
  private QuestionBankUseCase = new QuestionBankUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new QuestionBankController();
    }
    return this.instance;
  }

  async FetchQuestionBanks(params: Params) {
    try {
      this.setLoading();
      const dataState: DataState<QuestionBankModel[]> =
        await this.QuestionBankUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: "dialog",
        //   titleContent: "Vote Success",
        //   imageElement: successImage,
        //   messageContent: null,
        // });
        // console.log("url", this.state.value.data?.url);
        //  window.open(this.state.value.data?.url , '_blank');
      } else {
        throw new Error(this.state.value.error?.title);
      }
    } catch (error: any) {
      // DialogSelector.instance.errorDialog.openDialog({
      //   dialogName: "dialog",
      //   titleContent: error,
      //   imageElement: errorImage,
      //   messageContent: null,
      // });
      // console.log("Error in FetchOnlinePayment: ", error);
      return this.state;
    }
    return this.state;
  }
}
