import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "~/base/core/Params/params";
import type PurchasesModel from "../../Data/models/purchases_model";
import FetchPurchasesUseCase from "../../Domain/use_case/fetch_purchases_use_case";

export default class FetchPurchasesController extends ControllerInterface<PurchasesModel> {
  private static instance: FetchPurchasesController;
  private readonly useCase = new FetchPurchasesUseCase();

  private constructor() {
    super();
  }

  static getInstance(): FetchPurchasesController {
    if (!this.instance) this.instance = new FetchPurchasesController();
    return this.instance;
  }

  async fetchPurchases(params: Params) {
    this.setLoading();
    const dataState: DataState<PurchasesModel> = await this.useCase.call(params);
    this.setState(dataState);
    return this.state;
  }
}
