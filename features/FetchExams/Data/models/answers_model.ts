
import { toBooleanFlag } from "~/utils/examAttempts";

export default class AnswersModel {
  constructor(
    public id: number,
    public answer: string,
    public image: string,
    public correct: boolean | null,
    public isSelected: boolean,
  ) {}

  static fromMap(map: Record<string, any>): AnswersModel {
    const correct = map.correct == null ? null : toBooleanFlag(map.correct);

    return new AnswersModel(
      Number(map.id),
      map.answer ?? "",
      map.image ?? "",
      correct,
      toBooleanFlag(map.is_selected ?? map.selected),
    );
  }
}
