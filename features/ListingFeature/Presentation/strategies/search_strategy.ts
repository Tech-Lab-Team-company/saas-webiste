import type Params from "~/base/core/Params/params";
import type { SearchFilterStrategy } from "~/features/ListingFeature/Presentation/strategies/strategy_interface";
import SearchListingUseCase from "~/features/ListingFeature/Domain/use_case/search_listing_use_case";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";

export class SearchStrategy implements SearchFilterStrategy {
  private searchListingUseCase = new SearchListingUseCase();

  async execute(params: Params): Promise<DataState<any>> {
    // console.log("stagy")

    return await this.searchListingUseCase.call(params);
  }
}
