import type Params from "~/base/core/Params/params";
import type { SearchFilterStrategy } from "~/features/ListingFeature/Presentation/strategies/strategy_interface";
import type { DataState } from "~/base/core/networkStructure/Resources/dataState/data_state";
import FilterListingUseCase from "~/features/ListingFeature/Domain/use_case/filter_listing_use_case";

export class FilterStrategy implements SearchFilterStrategy {
  private filterListingUseCase = new FilterListingUseCase();

  async execute(params: Params): Promise<DataState<any>> {
    return await this.filterListingUseCase.call(params);
  }
}
