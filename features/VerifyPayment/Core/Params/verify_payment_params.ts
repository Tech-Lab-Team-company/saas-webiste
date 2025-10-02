import type Params from "~/base/core/Params/params";

export default class VerifyPaymentParams implements Params {
  public paymentmethodId: number;
  public paymentId: number;

  constructor(paymentmethodId: number, paymentId: number) {
    this.paymentmethodId = paymentmethodId;
    this.paymentId = paymentId;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["payment_method_id"] = this.paymentmethodId;
    data["payment_id"] = this.paymentId;
    return data;
  }
}
