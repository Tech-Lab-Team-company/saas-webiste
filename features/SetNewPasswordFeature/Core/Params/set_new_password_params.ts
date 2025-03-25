import type Params from "~/base/core/Params/params";

export default class SetNewPasswordParams implements Params {
  public email: string;
  public password: string;
  public confirmPassword: string;

  constructor(email: string, password: string, confirmPassword: string) {
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["email"] = this.email;
    data["password"] = this.password;
    data["password_confirmation"] = this.confirmPassword;
    return data;
  }
}

