import FilterListingParams from "~/features/ListingFeature/Core/Params/filter_params";

export default class FilterListingParamsBuilder {
  private static _instance: FilterListingParamsBuilder | null = null;

  private status: number | null = null;
  private countryId: number | null = null;
  private cityId: number | null = null;
  private rate: number | null = null;
  private distance: number | null = null;
  private priceRange: number[] | null = null;
  private address: string | null = null;
  public categoryId: number[] | null = null;
  public subCategoryId: number[] | null = null;
  public keyword: string | null = null;

  public lat: number | null = null;
  public lng: number | null = null;
  private page: number | null = 1;
  private limit: number | null = 9;

  // Private constructor to prevent instantiation
  private constructor() { }

  // Static method to get the singleton instance
  public static get Instance(): FilterListingParamsBuilder {
    if (!FilterListingParamsBuilder._instance) {
      FilterListingParamsBuilder._instance = new FilterListingParamsBuilder();
    }
    return FilterListingParamsBuilder._instance;
  }

  // Methods to set fields
  public setStatus(status: number): this {
    this.status = status;
    return this;
  }

  public setKeyword(keyword: string): this {
    this.keyword = keyword;
    return this;
  }
  public setCountryId(countryId: number): this {
    this.countryId = countryId;
    return this;
  }
  public setCityId(cityId: number) {
    this.cityId = cityId;
    return;
  }
  public setRate(rate: number): this {
    this.rate = rate;
    return this;
  }
  public setDistance(distance: number): this {
    this.distance = distance;
    return this;
  }
  public setPriceRange(priceRange: number[]): this {
    this.priceRange = priceRange;
    return this;
  }
  public setAddress(address: string): this {
    this.address = address;
    return this;
  }

  public setLat(lat: number): this {
    this.lat = lat;
    return this;
  }

  public setLng(lng: number): this {
    this.lng = lng;
    return this;
  }
  public setPage(page: number): this {
    this.page = page;
    return this;
  }
  public setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }

  public setCategoryID(categoryId: number[]): this {
    this.categoryId = categoryId;
    return this;
  }

  public setSubCategoryID(subCategoryId: number[]): this {
    this.subCategoryId = subCategoryId;
    // console.log(this.subCategoryId)
    return this;
  }

  public reset(): void {
    this.status = null;
    this.countryId = null;
    this.cityId = null;
    this.rate = null; // Ensure rate is reset
    this.distance = null;
    this.priceRange = null;
    this.address = null;
    this.categoryId = null;
    this.keyword = null;
    this.lat = 31.04768; // Default values
    this.lng = 31.3720832; // Default values
    this.page = 1; // Default values
    this.limit = 9; // Default values
  }

  // Build method to construct the FilterListingParams object
  public build(): FilterListingParams {
    // console.log(this, "Elsayed")
    return new FilterListingParams(
      this.status!,
      this.countryId!,
      this.cityId!,
      this.rate!,
      this.distance!,
      this.priceRange!,
      this.address!,
      this.categoryId!,
      this.subCategoryId!,
      this.keyword!,
      this.lat!,
      this.lng!,
      this.page!,
      this.limit!,
    );
  }
}
