import type Params from "~/base/core/Params/params";

type BookDeliveryData = {
  city: string;
  address: string;
  lat: number;
  lng: number;
  teacher_district: string;
  location_details: string;
};

export default class BookOnlinePaymentParams implements Params {
  constructor(
    private readonly bookId: number,
    private readonly paymentMethodId: number,
    private readonly callbackUrl: string,
    private readonly deliveryData: BookDeliveryData | null,
  ) {}

  toMap(): { [key: string]: unknown } {
    return {
      book_id: this.bookId,
      subscription_type: 1,
      payment_method_id: this.paymentMethodId,
      callback_url: this.callbackUrl,
      success_url: this.callbackUrl,
      back_url: this.callbackUrl,
      fail_url: this.callbackUrl,
      cancel_url: this.callbackUrl,
      ...(this.deliveryData ?? {}),
    };
  }
}
