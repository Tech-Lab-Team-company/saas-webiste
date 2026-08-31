import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import FetchQuestionBankQuestionsApiService from "../../Data/api_services/fetch_question_bank_questions_api_service";
import QuestionBankContentModel from "../../Data/models/question_bank_content_model";

export default class FetchQuestionBankQuestionsRepo extends RepoInterface<QuestionBankContentModel> {
  private static instance: FetchQuestionBankQuestionsRepo;

  private constructor() {
    super();
  }

  static getInstance(): FetchQuestionBankQuestionsRepo {
    if (!this.instance) this.instance = new FetchQuestionBankQuestionsRepo();
    return this.instance;
  }

  onParse(data: unknown): QuestionBankContentModel {
    return QuestionBankContentModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return FetchQuestionBankQuestionsApiService.getInstance();
  }
}
