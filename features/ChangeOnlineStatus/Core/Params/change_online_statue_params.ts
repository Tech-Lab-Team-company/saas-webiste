import type Params from "~/base/core/Params/params";
import type { OnlineStatusEnum } from "../Enums/online_statue.enum";

export default class ChangeOnlineStatusParams implements Params {
  public Status: OnlineStatusEnum;

  constructor(Status: OnlineStatusEnum) {
    this.Status = Status;
  }
  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["is_online"] = this.Status;
    return data;
  }
}

