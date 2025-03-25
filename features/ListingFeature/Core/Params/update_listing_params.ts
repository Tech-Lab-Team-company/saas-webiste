import type Params from "~/base/core/Params/params";
import BasicInformationParams from "./basic_information_params";
import LocationParams from "./location_params";
import OpeningHoursParams from "./opening_hours";
import PricingBookableServices from "./pricing_bookable_services";
import SocialParams from "~/features/ListingFeature/Core/Params/social_params";
export default class UpdateListingParams implements Params {
  public listingId: string;
  public basicInformation: BasicInformationParams;
  public Location: LocationParams;
  public social: SocialParams | null;
  public openingHours: OpeningHoursParams[];
  public pricingBookableServices: PricingBookableServices[];

  constructor(
    listingId: string,
    basicInformation: BasicInformationParams,
    Location: LocationParams,

    social: SocialParams | null,
    openingHours: OpeningHoursParams[],
    pricingBookableServices: PricingBookableServices[],
  ) {
    this.listingId = listingId;
    this.basicInformation = basicInformation;
    this.Location = Location;

    this.social = social;
    this.openingHours = openingHours;
    this.pricingBookableServices = pricingBookableServices;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["listing_id"] = this.listingId;
    data["basic_information"] = this.basicInformation.toMap();
    // console.log(data["basic_information"]);
    data["location_information"] = this.Location.toMap();
    data["sosial"] = this.social?.toMap();
    data["opening_hours"] = this.openingHours.map((item: OpeningHoursParams) =>
        item.toMap()).filter((item: any) => item.day_id);
    data["pricing_bookable_services"] = this.pricingBookableServices.map(
        (item: PricingBookableServices) => item.toMap(),
    ).filter((item: any) => item.day_id);
    data["pricing_bookable_services"] = this.pricingBookableServices.map(
      (item: PricingBookableServices) => item.toMap(),
    );
    return data;
  }
}
