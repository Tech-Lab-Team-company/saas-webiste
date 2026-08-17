import { toBooleanFlag } from "~/utils/examAttempts";
import AnswersModel from "./answers_model";

export default class QuestionsModel {
  constructor(
    public id: number,
    public image: string,
    public question: string,
    public article: number,
    public explainRequired: boolean,
    public imageRequired: boolean,
    public answerIdRequired: boolean,
    public answers: AnswersModel[],
    public questionType: number,
    public selectedAnswerId: number | null,
  ) {}

  static fromMap(map: Record<string, any>): QuestionsModel {
    const selectedAnswer =
      map.selected_answer_id ??
      map.student_answer_id ??
      map.user_answer_id ??
      map.submitted_answer_id ??
      map.selected_answer?.id ??
      map.student_answer?.id ??
      map.user_answer?.id ??
      map.answers?.find((answer: Record<string, any>) =>
        toBooleanFlag(answer.is_selected ?? answer.selected),
      )?.id;
    const selectedAnswerId = Number(selectedAnswer);

    return new QuestionsModel(
      Number(map.id),
      map.image ?? "",
      map.question ?? "",
      Number(map.article ?? 0),
      toBooleanFlag(map.explain_required),
      toBooleanFlag(map.image_required),
      map.answer_id_required == null
        ? true
        : toBooleanFlag(map.answer_id_required),
      Array.isArray(map.answers) ? map.answers.map(AnswersModel.fromMap) : [],
      Number(map.question_type ?? 0),
      Number.isFinite(selectedAnswerId) && selectedAnswerId > 0
        ? selectedAnswerId
        : null,
    );
  }
}
