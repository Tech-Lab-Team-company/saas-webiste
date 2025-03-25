import type Params from "~/base/core/Params/params";
import TimeParams from "~/features/ListingFeature/Core/Params/time_params";

export default class DaysParams implements Params {
  public day: string;
  public time: TimeParams[] = [];
  constructor(day: string, time: TimeParams[]) {
    this.day = day;
    this.time = time;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["day"] = this.day;
    data["time"] = this.time.map((item) => item.toMap());
    return data;
  }
}
