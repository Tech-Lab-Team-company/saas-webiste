import type Params from "~/base/core/Params/params";
import type CountryModel from "~/features/FetchCountriesFeature/Data/models/country_model";
import type CityModel from "~/features/FetchCitiesFeature/Data/models/city_model";

export default class LocationParams implements Params {
  public latitude: number;
  public longitude: number;
  public address: string;
  public friendlyAddress: string;
  public region: string;
  public googlePlaceId: string;
  public country: CountryModel;
  public city: CityModel;

  constructor(
    latitude: number,
    longitude: number,
    address: string,
    friendlyAddress: string,
    region: string,
    googlePlaceId: string,
    country: CountryModel,
    city: CityModel,
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.friendlyAddress = friendlyAddress;
    this.region = region;
    this.googlePlaceId = googlePlaceId;
    this.country = country;
    this.city = city;
  }

  toMap(): { [p: string]: any } {
    const map: { [p: string]: any } = {};
    map["lat"] = this.latitude.toString();
    map["lng"] = this.longitude.toString();
    map["address"] = this.address;
    map["friendly_address"] = this.friendlyAddress;
    map["region"] = this.region;
    map["google_map_id"] = this.googlePlaceId;
    map["country_id"] = this.country.id;
    map["city_id"] = this.city.id;
    return map;
  }
}
