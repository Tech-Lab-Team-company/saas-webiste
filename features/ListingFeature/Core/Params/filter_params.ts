import type Params from "~/base/core/Params/params";

export default class FilterListingParams implements Params {
  public status: number;
  public countryId: number;
  public cityId: number;
  public rate: number;
  public distance: number;
  public priceRange: number[];
  public address: string;
  public categoryId: number[];
  public subCategoryId: number[];
  public keyword: string;
  public lat: number;
  public lng: number;
  public page?: number;
  public limit?: number;

  constructor(
    status: number,
    countryId: number,
    cityId: number,
    rate: number,
    distance: number,
    priceRange: number[],
    address: string,
    categoryId: number[],
    subCategoryId: number[],
    keyword: string,
    lat: number,
    lng: number,
    page: number,
    limit: number,
  ) {
    this.status = status;
    this.countryId = countryId;
    this.cityId = cityId;
    this.rate = rate;
    this.distance = distance;
    this.priceRange = priceRange;
    this.address = address;
    this.categoryId = categoryId;
    this.subCategoryId = subCategoryId;
    this.keyword = keyword;
    this.lat = lat;
    this.lng = lng;
    this.page = page;
    this.limit = limit;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    if (this.status) data["status"] = this.status;
    if (this.countryId) data["country_id"] = this.countryId;
    if (this.cityId) data["city_id"] = this.cityId;
    if (this.rate) data["rate"] = this.rate;
    if (this.distance) data["distance"] = this.distance;
    if (this.priceRange) data["price_range"] = this.priceRange;
    if (this.address) data["address"] = this.address;
    if (this.categoryId) data["category_ids"] = this.categoryId;
    if (this.subCategoryId) data["sub_category_ids"] = this.subCategoryId;
    if (this.lat) data["lat"] = this.lat;
    if (this.lng) data["lng"] = this.lng;
    if(this.keyword) data["keyword"] = this.keyword;
    data["page"] = this.page;
    data["limit"] = this.limit;
    return data;
  }
}
