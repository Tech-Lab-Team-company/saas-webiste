import ListingModel from "~/features/ListingFeature/Data/models/listing_index_model";

export default class SearchListingModel {
  public listings: ListingModel[];
  public similarListings: ListingModel[];

  constructor(listings: ListingModel[], similarListings: ListingModel[]) {
    this.listings = listings;
    this.similarListings = similarListings;
  }

  static fromMap(map: { [key: string]: any }): SearchListingModel {
    const listings: ListingModel[] = [];
    if (map["listings"].length > 0) {
      map["listings"].forEach((item: any) =>
        listings.push(ListingModel.fromMap(item)),
      );
    }

    const similarListings: ListingModel[] = [];
    if (map["similar_listings"].length > 0) {
      map["similar_listings"].forEach((item: any) =>
        similarListings.push(ListingModel.fromMap(item)),
      );
    }
    return new SearchListingModel(listings, similarListings);
  }
}
