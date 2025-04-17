import type TitleModel from "~/base/core/Models/title_model";
import type QuestionsModel from "./questions_model";


export default class QuestionAnswerModel {
  public id: number;





  constructor(
    id: number,



  ) {
    this.id = id;


 
  }


  static fromMap(map: { [key: string]: any }): QuestionAnswerModel {
    return new QuestionAnswerModel(
      map["id"],
      

    );
  }
}

