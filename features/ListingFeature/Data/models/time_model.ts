import { formatTimeToAmPm } from "~/base/persention/utils/format_to_am_pm";

export default class TimeModel {
  public openingTime: string;
  public closingTime: string;
  constructor(openingTime: string, closingTime: string) {
    this.openingTime = openingTime;
    this.closingTime = closingTime;
  }
  static fromMap(map: { [key: string]: any }): TimeModel {
    return new TimeModel(
      formatTimeToAmPm(map["opening_time"]),
      formatTimeToAmPm(map["closing_time"]),
    );
  }
}
