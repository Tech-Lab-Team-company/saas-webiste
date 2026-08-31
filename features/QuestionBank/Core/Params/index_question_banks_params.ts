import type Params from "~/base/core/Params/params";

export default class QuestionBankParams implements Params {
  constructor(
    public word?: string,
    public yearId?: number,
  ) {}

  toMap(): Record<string, string | number> {
    const data: Record<string, string | number> = {};
    const normalizedWord = this.word?.trim();

    if (normalizedWord) {
      data.word = normalizedWord;
    }

    if (Number.isInteger(this.yearId) && Number(this.yearId) > 0) {
      data.year_id = Number(this.yearId);
    }

    return data;
  }
}
