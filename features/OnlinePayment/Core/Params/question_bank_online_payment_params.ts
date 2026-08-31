import type Params from "~/base/core/Params/params";

export default class QuestionBankOnlinePaymentParams implements Params {
  private readonly questionBankId: number;
  private readonly paymentMethodId: number;
  private readonly callbackUrl: string;

  constructor(
    questionBankId: number,
    paymentMethodId: number,
    callbackUrl: string,
  ) {
    this.questionBankId = questionBankId;
    this.paymentMethodId = paymentMethodId;
    this.callbackUrl = callbackUrl;
  }

  toMap(): Record<string, string | number> {
    return {
      question_bank_id: this.questionBankId,
      subscription_type: 1,
      payment_method_id: this.paymentMethodId,
      callback_url: this.callbackUrl,
      success_url: this.callbackUrl,
      back_url: this.callbackUrl,
      fail_url: this.callbackUrl,
      cancel_url: this.callbackUrl,
    };
  }
}
