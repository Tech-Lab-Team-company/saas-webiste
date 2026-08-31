import { ApiNames } from "~/base/core/networkStructure/apiNames";
import { CrudType } from "~/base/core/Params/call_params_interface";
import type Params from "~/base/core/Params/params";
import ServicesInterface from "~/base/Data/ApiService/api_service_interface";

export default class FetchQuestionBankQuestionsApiService extends ServicesInterface {
  private static instance: FetchQuestionBankQuestionsApiService;

  private constructor() {
    super();
  }

  static getInstance(): FetchQuestionBankQuestionsApiService {
    if (!this.instance) {
      this.instance = new FetchQuestionBankQuestionsApiService();
    }
    return this.instance;
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    return super.call({
      url: ApiNames.Instance.fetchQuestionBankQuestions,
      type: CrudType.GET,
      auth: true,
      details: params.toMap(),
      showLoadingDialog: false,
    });
  }
}
