import SearchListingParams from "~/features/ListingFeature/Core/Params/search_listing_params";

export default class SearchBuilder {
  private static _instance: SearchBuilder;

  private keyword: string | null = null;
  private lat: number = 0;
  private lng: number = 0;
  private page: number = 1;
  private constructor() {}
  public static get Instance() {
    if (!this._instance) {
      this._instance = new SearchBuilder();
    }
    return this._instance;
  }

  setKey(keyword: string): this {
    this.keyword = keyword;
    return this;
  }

  setLat(lat: number): this {
    this.lat = lat;
    return this;
  }

  setLng(lng: number): this {
    this.lng = lng;
    return this;
  }

  setPage(page: number): this {
    this.page = page;
    return this;
  }

  build(): SearchListingParams {
    return new SearchListingParams(this.keyword!, this.lat, this.lng, this.page, 10);
  }
}
