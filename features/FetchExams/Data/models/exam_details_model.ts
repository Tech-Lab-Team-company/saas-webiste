import TitleModel from "~/base/core/Models/title_model";
import QuestionsModel from "./questions_model";
import { toBooleanFlag } from "~/utils/examAttempts";

export default class ExamDetailsModel {
  public id: number;
  public courseId: number | null;
  public title: string; // Use 'string' instead of 'String'
  public startTime: string;
  public endTime: string;
  public date: string;
  public examMark: number;
  public isFinished: boolean;
  public mark: number;
  public wrongAnswersCount: number;
  public correctAnswersCount: number;
  public unansweredQuestionsCount: number;
  public subject: TitleModel | null;
  public questions: QuestionsModel[];
  public examType: number;
  public degreeType: number;
  public allow_shuffle: number;
  public duration: number;
  public number_of_questions: number;
  public edit_answer: number;
  public attended: boolean;
  public allowMultipleAttempts: boolean;
  public isTimeRequired: boolean;

  constructor(
    id: number,
    courseId: number | null,
    title: string,
    startTime: string,
    endTime: string,
    date: string,
    examMark: number,
    isFinished: boolean,
    mark: number,
    wrongAnswersCount: number,
    correctAnswersCount: number,
    unansweredQuestionsCount: number,
    subject: TitleModel | null,
    questions: QuestionsModel[],
    examType: number,
    degreeType: number,
    allow_shuffle: number,
    duration: number,
    number_of_questions: number,
    edit_answer: number,
    attended: boolean,
    allowMultipleAttempts: boolean,
    isTimeRequired: boolean,
  ) {
    this.id = id;
    this.courseId = courseId;
    this.title = title;
    this.startTime = startTime;
    this.endTime = endTime;
    this.date = date;
    this.examMark = examMark;
    this.isFinished = isFinished;
    this.mark = mark;
    this.wrongAnswersCount = wrongAnswersCount;
    this.correctAnswersCount = correctAnswersCount;
    this.unansweredQuestionsCount = unansweredQuestionsCount;
    this.subject = subject;
    this.questions = questions;
    this.examType = examType;
    this.degreeType = degreeType;
    this.allow_shuffle = allow_shuffle;
    this.duration = duration;
    this.number_of_questions = number_of_questions;
    this.edit_answer = edit_answer;
    this.attended = attended;
    this.allowMultipleAttempts = allowMultipleAttempts;
    this.isTimeRequired = isTimeRequired;
  }

  static fromMap(map: { [key: string]: any }): ExamDetailsModel {
    return new ExamDetailsModel(
      Number(map["id"]),
      map["course_id"] == null ? null : Number(map["course_id"]),
      map["title"] ?? "",
      map["start_time"] ?? "",
      map["end_time"] ?? "",
      map["date"] ?? "",
      Number(map["exam_mark"] ?? 0),
      toBooleanFlag(map["is_finished"]),
      Number(map["mark"] ?? 0),
      Number(map["wrong_answers_count"] ?? 0),
      Number(map["correct_answers_count"] ?? 0),
      Number(map["unanswered_questions_count"] ?? 0),
      map["subject"] ? TitleModel.fromMap(map["subject"]) : null,
      Array.isArray(map["questions"])
        ? map["questions"].map(QuestionsModel.fromMap)
        : [],
      Number(map["exam_type"] ?? 0),
      Number(map["degree_type"] ?? 0),
      Number(map["allow_shuffle"] ?? 0),
      Number(map["duration"] ?? 0),
      Number(map["number_of_questions"] ?? 0),
      Number(map["edit_answer"] ?? 0),
      toBooleanFlag(map["attended"]),
      toBooleanFlag(map["allow_multiple_attempts"]),
      toBooleanFlag(map["is_time_required"]),
    );
  }
}
