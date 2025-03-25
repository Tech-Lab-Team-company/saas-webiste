import { ControllerInterface } from "~/base/persention/Controller/controller_interface";
import type Params from "~/base/core/Params/params";
import errorImage from "~/assets/images/error.png";
import DialogSelector from "~/base/persention/Dialogs/dialog_selector";
import type { SearchFilterStrategy } from "~/features/ListingFeature/Presentation/strategies/strategy_interface";

export default class SearchListingController extends ControllerInterface<any> {
  private static instance: SearchListingController;
  private strategy: SearchFilterStrategy | null = null;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SearchListingController();
    }
    return this.instance;
  }

  setStrategy(strategy: SearchFilterStrategy) {
    this.strategy = strategy;
  }

  async executeStrategy(params: Params) {
    if (!this.strategy) {
      throw new Error("No strategy set");
    }
    try {
      this.setLoading();
      const dataState = await this.strategy.execute(params);
      this.setState(dataState);

      if (this.isDataSuccess()) {
        return this.state;
      } else {
        throw new Error(this.state.value.error?.title || "Operation failed");
      }
    } catch (error: any) {
      return this.state;
    }
  }
}
