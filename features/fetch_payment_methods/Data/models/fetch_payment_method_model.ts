import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";

export default class PaymentMethodModel {
  public id: number;


  constructor(
    id: number,

  ) {
    this.id = id;
 
  }


  static fromMap(map: { [key: string]: any }): PaymentMethodModel {
    return new PaymentMethodModel(
      map["id"],
    );
  }
}



