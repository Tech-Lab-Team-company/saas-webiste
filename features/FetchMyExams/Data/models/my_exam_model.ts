import TitleModel from "~/base/core/Models/title_model";
import { toBooleanFlag } from "~/utils/examAttempts";

export default class MyExamModel {
  constructor(
    public id: number,
    public title: string,
    public startTime: string,
    public endTime: string,
    public date: string,
    public examMark: number,
    public isFinished: boolean,
    public mark: number,
    public attended: boolean,
    public wrongAnswersCount: number,
    public correctAnswersCount: number,
    public unansweredQuestionsCount: number,
    public subject: TitleModel | null,
    public examType: number,
    public degreeType: number,
    public allowShuffle: boolean,
    public editAnswer: boolean,
    public isTimeRequired: boolean,
    public duration: number,
    public numberOfQuestions: number,
    public allowMultipleAttempts: boolean,
    public courseId: number | null,
  ) {}

  static fromMap(map: Record<string, any>): MyExamModel {
    return new MyExamModel(
      Number(map.id),
      map.title ?? "اختبار بدون عنوان",
      map.start_time ?? "",
      map.end_time ?? "",
      map.date ?? "",
      Number(map.exam_mark ?? 0),
      toBooleanFlag(map.is_finished),
      Number(map.mark ?? 0),
      toBooleanFlag(map.attended),
      Number(map.wrong_answers_count ?? 0),
      Number(map.correct_answers_count ?? 0),
      Number(map.unanswered_questions_count ?? 0),
      map.subject ? TitleModel.fromMap(map.subject) : null,
      Number(map.exam_type ?? 0),
      Number(map.degree_type ?? 0),
      toBooleanFlag(map.allow_shuffle),
      toBooleanFlag(map.edit_answer),
      toBooleanFlag(map.is_time_required),
      Number(map.duration ?? 0),
      Number(map.number_of_questions ?? 0),
      toBooleanFlag(map.allow_multiple_attempts),
      map.course_id == null ? null : Number(map.course_id),
    );
  }
}
