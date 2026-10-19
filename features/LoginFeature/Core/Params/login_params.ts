import type Params  from "~/base/core/Params/params";

export default class LoginParams implements Params {
  public credential: string;
  public password: string;
  public macAddress: string | null;

  constructor(credential: string, password: string, macAddress: string | null = null) {
    this.credential = credential;
    this.password = password;
    this.macAddress = macAddress;
  }
  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["credentials"] = this.credential;
    data["password"] = this.password;
    if (this.macAddress) data["mac_address"] = this.macAddress;
    return data;
  }
}
