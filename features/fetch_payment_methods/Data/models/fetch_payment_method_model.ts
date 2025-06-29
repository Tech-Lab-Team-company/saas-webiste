
export default class PaymentMethodModel {
  public id: number;
  public account_number: string;
  public currency: string;
  public image: string;
  public title: string;
  public type: Number;


  constructor(
    id: number,
    account_number: string,
    currency: string,
    image: string,
    title: string,
    type: Number,

  ) {
    this.id = id;
    this.account_number = account_number;
    this.currency = currency;
    this.image = image;
    this.title = title;
    this.type = type;
 
  }


  static fromMap(map: { [key: string]: any }): PaymentMethodModel {
    return new PaymentMethodModel(
      map["id"],
      map["account_number"],
      map["currency"],
      map["image"],
      map["title"],
      map["type"],
    );
  }
}



