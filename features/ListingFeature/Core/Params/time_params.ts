import {extractAndAddHours} from "~/base/persention/utils/extract_time";

export default class TimeParams {
  public from: string;
  public to: string;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["opening_time"] = extractAndAddHours(this.from);
    data["closing_time"] = extractAndAddHours(this.to);
    return data;
  }
}
