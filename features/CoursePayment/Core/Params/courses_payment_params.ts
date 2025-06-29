import type Params from "@/base/core/Params/params";


export default class CoursesPaymentParams implements Params {
    CourseId: number;
    PaymentMethod: number |null;
    Account: String |null;
    Receipt: File|null;



  constructor(
    data:{
      CourseId: number,
      PaymentMethod: number|null,
      Account: String,
      Receipt: File|null,
    }



  ) {
    this.CourseId = data.CourseId;
    this.PaymentMethod = data.PaymentMethod;
    this.Account = data.Account;
    this.Receipt = data.Receipt;
;


  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
     data["course_id"] = this.CourseId
     if(this.PaymentMethod)data["payment_method_id"] = this.PaymentMethod
     if(this.Account)data["transfered_account"] = this.Account
     if(this.Receipt) data["receipt"] = this.Receipt
 
    return data;
  }
}
