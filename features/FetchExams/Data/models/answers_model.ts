
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
    return new AnswersModel(
      Number(map.id),
      map.answer ?? "",
      map.image ?? "",
      // Correctness must not live in the active exam's client-side model.
      // The API must also omit it so it is never exposed in the response.
      null,
      toBooleanFlag(map.is_selected ?? map.selected),
    );
  }
}
