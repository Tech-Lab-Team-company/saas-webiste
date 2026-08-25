import type Params from "~/base/core/Params/params";

export type PurchaseOrderableType = 1 | 5 | 6 | 14;

export default class FetchPurchasesParams implements Params {
  public readonly orderableType: PurchaseOrderableType | null;

  constructor(orderableType: PurchaseOrderableType | null = null) {
    this.orderableType = orderableType;
  }

  toMap(): { [key: string]: number } {
    return this.orderableType === null
      ? {}
      : { orderable_type: this.orderableType };
  }
}
