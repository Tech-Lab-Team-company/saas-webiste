import RepoInterface from "~/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "~/base/Data/ApiService/api_service_interface";
import FetchPurchasesApiService from "../../Data/api_services/fetch_purchases_api_service";
import PurchasesModel from "../../Data/models/purchases_model";

export default class FetchPurchasesRepo extends RepoInterface<PurchasesModel> {
  private static instance: FetchPurchasesRepo;

  private constructor() {
    super();
  }

  static getInstance(): FetchPurchasesRepo {
    if (!this.instance) this.instance = new FetchPurchasesRepo();
    return this.instance;
  }

  onParse(data: unknown): PurchasesModel {
    return PurchasesModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return FetchPurchasesApiService.getInstance();
  }
}
