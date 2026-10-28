import type Params  from "~/base/core/Params/params";

export default class LoginParams implements Params {
  public credential: string;
  public password: string;
  public deviceUuid: string | null;

  constructor(credential: string, password: string, deviceUuid: string | null = null) {
    this.credential = credential;
    this.password = password;
    this.deviceUuid = deviceUuid;
  }
  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["credentials"] = this.credential;
    data["password"] = this.password;
    if (this.deviceUuid) data["deviceUuid"] = this.deviceUuid;
    return data;
  }
}
