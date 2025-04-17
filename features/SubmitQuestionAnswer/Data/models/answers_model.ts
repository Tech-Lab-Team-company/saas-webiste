
export default class AnswersModel {
  public id: number;
  public answer: string;
  public image: string;
  public correct: number;






  constructor(
    id: number,
    answer: string,
    image: string,
    correct: number,




  ) {
    this.id = id;
    this.answer = answer;
    this.image = image;
    this.correct = correct;


 
  }


  static fromMap(map: { [key: string]: any }): AnswersModel {
    return new AnswersModel(
      map["id"],
      map["answer"],
      map["image"],
      map["correct"],
    );
  }
}
