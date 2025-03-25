import type Params from "~/base/core/Params/params";
import BasicInformationParams from "./basic_information_params";
import LocationParams from "./location_params";
import OpeningHoursParams from "./opening_hours";
import PricingBookableServices from "./pricing_bookable_services";
import SocialParams from "~/features/ListingFeature/Core/Params/social_params";

export default class ListingParams implements Params {
  public basicInformation: BasicInformationParams;
  public Location: LocationParams;
  public gallery: string[];
  public details: string[];
  public social: SocialParams | null;
  public openingHours: OpeningHoursParams[];
  public pricingBookableServices: PricingBookableServices[];
  public hasOpeningHours: boolean = false;

  constructor(
    basicInformation: BasicInformationParams,
    Location: LocationParams,
    gallery: string[],
    details: string[],
    social: SocialParams | null,
    openingHours: OpeningHoursParams[],
    pricingBookableServices: PricingBookableServices[],
    hasOpeningHours: boolean = false,
  ) {
    this.basicInformation = basicInformation;
    this.Location = Location;
    this.gallery = gallery;
    this.details = details;
    this.social = social;
    this.openingHours = openingHours;
    this.pricingBookableServices = pricingBookableServices;
    this.hasOpeningHours = hasOpeningHours;
  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
    data["basic_information"] = this.basicInformation.toMap();
    // console.log(data["basic_information"]);
    data["location_information"] = this.Location.toMap();
    data["gallery"] = this.gallery;
    data["images"] = this.details;
    data["sosial"] = this.social?.toMap();
    data["opening_hours"] = this.openingHours.map((item: OpeningHoursParams) =>
      item.toMap()).filter((item: any) => item.day_id);
    data["pricing_bookable_services"] = this.pricingBookableServices.map(
      (item: PricingBookableServices) => item.toMap(),
    ).filter((item: any) => item.day_id);
    data["has_opening_hours"] = this.hasOpeningHours ? 1 : 0;
    return data;
  }
}
