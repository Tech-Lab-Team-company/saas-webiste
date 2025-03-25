import type Params  from "~/base/core/Params/params";

export default class ChangePasswordParams implements Params {
  public currentPassword: string;
  public newPassword: string;
  public newPasswordConfirmation: string;

  constructor(currentPassword: string, newPassword: string, newPasswordConfirmation: string) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword
    this.newPasswordConfirmation = newPasswordConfirmation
  }
  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["current_password"] = this.currentPassword;
    data["new_password"] = this.newPassword;
    data["new_password_confirmation"] = this.newPasswordConfirmation;
    return data;
  }
}

