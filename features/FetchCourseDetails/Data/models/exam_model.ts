import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type SessionsModel from "./sessions_model";
import type TitleModel from "~/base/core/Models/title_model";

export default class ExamsModel {
  public id: number;
  public title: string;
  public StrartTime: string;
  public EndTime: string;
  public date: string;
  public ExamMark: number;
  public isFinished: boolean;
  public Mark: number;
  public Subject: TitleModel[];
  public degree_type: number;
  public number_of_questions: number;
  public correct_answers_count: number;
  public wrong_answers_count: number;
  public unanswered_questions_count: number;

  constructor(
    id: number,
    title: string,
    StrartTime: string,
    EndTime: string,
    date: string,
    ExamMark: number,
    isFinished: boolean,
    Mark: number,
    Subject: TitleModel[],
    degree_type: number,
    number_of_questions: number,
    correct_answers_count: number,
    wrong_answers_count: number,
    unanswered_questions_count: number,
  ) {
    this.id = id;
    this.title = title;
    this.StrartTime = StrartTime;
    this.EndTime = EndTime;
    this.date = date;
    this.ExamMark = ExamMark;
    this.isFinished = isFinished;
    this.Mark = Mark;
    this.Subject = Subject;
    this.degree_type = degree_type;
    this.number_of_questions = number_of_questions;
    this.correct_answers_count = correct_answers_count;
    this.wrong_answers_count = wrong_answers_count;
    this.unanswered_questions_count = unanswered_questions_count;
  }

  static fromMap(map: { [key: string]: any }): ExamsModel {
    return new ExamsModel(
      map["id"],
      map["title"],
      map["start_time"],
      map["end_time"],
      map["date"],
      map["exam_mark"],
      map["is_finished"],
      map["mark"],
      map["subject"],
      map["degree_type"],
      map["number_of_questions"],
      map["correct_answers_count"] ?? 0,
      map["wrong_answers_count"] ?? 0,
      map["unanswered_questions_count"] ?? 0,
    );
  }
}

// "id": 225,
// "title": "",
// "start_time": "2024-10-05 20:28:00",
// "end_time": "2024-10-06 22:24:00",
// "date": "2024-10-05",
// "exam_mark": 30,
// "is_finished": false,
// "mark": 0,
// "subject": {
//     "id": 2873,
//     "title": "رياضة 1"
// }
