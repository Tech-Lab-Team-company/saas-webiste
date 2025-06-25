import type TitleModel from "~/base/core/Models/title_model";
import type QuestionsModel from "./questions_model";


export default class ExamDetailsModel {
  public id: number;
  public title: string; // Use 'string' instead of 'String'
  public startTime: string; 
  public endTime: string; 
  public date: string; 
  public examMark: number; 
  public isFinished: boolean; 
  public mark: number; 
  public subject: TitleModel; 
  public questions: QuestionsModel[]; 
  public examType: number; 
  public allow_shuffle: number; 




  constructor(
    id: number,
    title: string,
    startTime: string,
    endTime: string,
    date: string,
    examMark: number,
    isFinished: boolean,
    mark: number,
    subject: TitleModel,
    questions: QuestionsModel[],
    examType: number,
    allow_shuffle: number,


  ) {
    this.id = id;
    this.title = title;
    this.startTime = startTime;
    this.endTime = endTime;
    this.date = date;
    this.examMark = examMark;
    this.isFinished = isFinished;
    this.mark = mark;
    this.subject = subject;
    this.questions = questions;
    this.examType = examType;
    this.allow_shuffle = allow_shuffle;

 
  }


  static fromMap(map: { [key: string]: any }): ExamDetailsModel {
    return new ExamDetailsModel(
      map["id"],
      map["title"],
      map["start_time"],
      map["end_time"],
      map["date"],
      map["exam_mark"],
      map["is_finished"],
      map["mark"],
      map["subject"],
      map["questions"],
      map["exam_type"],
      map["allow_shuffle"],
    );
  }
}

