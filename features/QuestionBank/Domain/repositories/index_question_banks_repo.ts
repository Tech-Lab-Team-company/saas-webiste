import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import QuestionBankModel from "../../Data/models/question_banks_model";
import { QuestionBankApiService } from "../../Data/api_services/index_question_banks_api_services";

class QuestionBankRepo extends RepoInterface<QuestionBankModel[]> {
  private static instance: QuestionBankRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new QuestionBankRepo();
    }
    return this.instance;
  }

  onParse(data: unknown): QuestionBankModel[] {
    if (!Array.isArray(data)) return [];
    return data.map((item) =>
      QuestionBankModel.fromMap(item as Record<string, unknown>),
    );
  }

  get serviceInstance(): ServicesInterface {
    return QuestionBankApiService.getInstance();
  }
}

export { QuestionBankRepo };
