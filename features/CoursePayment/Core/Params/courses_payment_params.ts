import type Params from "@/base/core/Params/params";


export default class CoursesPaymentParams implements Params {
    CourseId: number;
    PaymentMethod: number |null;
    Account: number |null;
    Receipt: File|null;



  constructor(
    CourseId: number,
    PaymentMethod: number,
    Account: number,
    Receipt: File|null,



  ) {
    this.CourseId = CourseId;
    this.PaymentMethod = PaymentMethod;
    this.Account = Account;
    this.Receipt = Receipt;
;


  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
     data["course_id"] = this.CourseId
     data["payment_method_id"] = this.PaymentMethod
     data["transfered_account"] = this.Account
     data["receipt"] = this.Receipt
 
    return data;
  }
}
