import { VoteReviewsApiService } from "~/features/VoteReviewFeature/Data/api_services/vote_review_api_service";
import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import {  QuestionsAnswreApiService } from "../../Data/api_services/submit_question_answer_api_services";
// import UserModel from "../../Data/models/education_stages_model";
import QuestionAnswerModel from "../../Data/models/submit_question_answer_model";

class QuestionAnswerRepo extends RepoInterface<QuestionAnswerModel> {
  private static instance: QuestionAnswerRepo;
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new QuestionAnswerRepo();
    }
    return this.instance;
  }


  onParse(data: any): QuestionAnswerModel {
    return  QuestionAnswerModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return QuestionsAnswreApiService.getInstance();
  }
}

export { QuestionAnswerRepo };
