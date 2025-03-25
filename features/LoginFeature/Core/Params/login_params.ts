import type Params  from "~/base/core/Params/params";

export default class LoginParams implements Params {
  public credential: string;
  public password: string;
  public device_token: string;

  constructor(credential: string, password: string, device_token: string) {
    this.credential = credential;
    this.password = password;
    this.device_token = device_token;
  }
  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["email"] = this.credential;
    data["password"] = this.password;
    data["device_token"] = this.device_token;
    return data;
  }
}

