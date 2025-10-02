import type Params from "~/base/core/Params/params";

export default class OnlinePaymentParams implements Params {
  public courseId: string;
  public paymentmethodId: string;
  public coupon: string | null;
  public callbackUrl: string;
  public succesUrl: string;
  public backUrl: string;
  public failUrl: string;
  public cancelUrl: string;

  constructor(
    courseId: string,
    paymentmethodId: string,
    coupon: string | null,
    callbackUrl: string,
    succesUrl: string,
    backUrl: string,
    failUrl: string,
    cancelUrl: string
  ) {
    this.courseId = courseId;
    this.paymentmethodId = paymentmethodId;
    this.coupon = coupon;
    this.callbackUrl = callbackUrl;
    this.succesUrl = succesUrl;
    this.backUrl = backUrl;
    this.failUrl = failUrl;
    this.cancelUrl = cancelUrl;
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["course_id"] = this.courseId;
    data["payment_method_id"] = this.paymentmethodId;
    if (this.coupon !== null) data["coupon"] = this.coupon;
    data["callback_url"] = this.callbackUrl;
    data["success_url"] = this.succesUrl;
    data["back_url"] = this.backUrl;
    data["fail_url"] = this.failUrl;
    data["cancel_url"] = this.cancelUrl;
    return data;
  }
}
