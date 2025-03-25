import type Params from "~/base/core/Params/params";

  export default class PricingBookableServices implements Params {
  public type: string;
  public price: number;
  public description: string;
  public title: string;
  public isBookable: number;
  public fee: number;
  public quantity: number;
  public category: number;

  constructor(
    type: string,
    price: number,
    description: string,
    title: string,
    isBookable: number = 0,
    fee: number,
    quantity: number,
    category: number,
  ) {
    this.type = type;
    this.price = price;
    this.description = description;
    this.title = title;
    this.isBookable = isBookable;
    this.fee = fee;
    this.quantity = quantity;
    this.category = category;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["type"] = this.type;
    data["price"] = this.price;
    data["description"] = this.description;
    data["title"] = this.title;
    data["isBookable"] = this.isBookable;
    data["fee"] = this.fee;
    data["quantity"] = this.quantity;
    data["category"] = this.category;
    return data;
  }
}
