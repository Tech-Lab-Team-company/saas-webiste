import type CountryModel from "~/features/FetchCountriesFeature/Data/models/country_model";
import type CityModel from "~/features/FetchCitiesFeature/Data/models/city_model";

export default class LocationModel {
  address: string;
  lat: number;
  lng: number;
  googleMapId: string;
  country: CountryModel;
  city: CityModel;
  friendlyAddress: string;

  constructor(
    address: string,
    lat: number,
    lng: number,
    googleMapId: string,
    country: CountryModel,
    city: CityModel,
    friendlyAddress: string = "",
  ) {
    this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.googleMapId = googleMapId;
    this.country = country;
    this.city = city;
    this.friendlyAddress = friendlyAddress;
  }

  static fromMap(map: { [key: string]: any }): LocationModel {
    return new LocationModel(
      map["address"],
      Number(map["lat"]),
      Number(map["long"]),
      map["google_map_id"],
      map["country"],
      map["city"],
      map["friendly_address"],
    );
  }
}
