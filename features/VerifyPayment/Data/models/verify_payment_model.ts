import type TitleModel from "~/base/core/Models/title_model";
import type TeacherModel from "~/features/FetchCourseDetails/Data/models/teacher_model";

export default class VerifyPaymentModel {
  public id: number;
  public status: number;

  constructor(id: number, status: number) {
    this.id = id;
    this.status = status;
  }

  static fromMap(map: { [key: string]: any }): VerifyPaymentModel {
    return new VerifyPaymentModel(map["id"], map["status"]);
  }
}
