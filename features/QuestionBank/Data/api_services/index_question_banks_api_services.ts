import { ApiNames } from "~/base/core/networkStructure/apiNames";
import ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import { CrudType } from "~/base/core/Params/call_params_interface";
import type Params from "~/base/core/Params/params";

class QuestionBankApiService extends ServicesInterface {
  private static instance: QuestionBankApiService;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new QuestionBankApiService();
    }
    return this.instance;
  }

  async applyService(
    params: Params,
  ): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.Instance.fetchQuestionBanks,
      type: CrudType.GET,
      // The endpoint stays public for guests, while an available token lets the
      // API return the student's subscription state for every bank.
      auth: true,
      details: params.toMap(),
      showLoadingDialog: false,
    });
  }
}

export { QuestionBankApiService };
