import type TitleModel from "~/base/core/Models/title_model";
import type AnswersModel from "./answers_model";


export default class QuestionsModel {
  public id: number;
  public image: string;
  public question: string;
  public article: number;
  public explainRequired: number;
  public imageRequired: number;
  public answerIdRequired: number;
  public answers: AnswersModel[];
  public questionType: number;





  constructor(
    id: number,
    image: string,
    question: string,
    article: number,
    explainRequired: number,
    imageRequired: number,
    answerIdRequired: number,
    answers: AnswersModel[],
    questionType: number,



  ) {
    this.id = id;
    this.image = image;
    this.question = question;
    this.article = article;
    this.explainRequired = explainRequired;
    this.imageRequired = imageRequired;
    this.answerIdRequired = answerIdRequired;
    this.answers = answers;
    this.questionType = questionType;

 
  }


  static fromMap(map: { [key: string]: any }): QuestionsModel {
    return new QuestionsModel(
      map["id"],
      map["image"],
      map["question"],
      map["article"],
      map["explain_required"],
      map["image_required"],
      map["answer_id_required"],
      map["answers"],
      map["question_type"],


    );
  }
}



                      
                