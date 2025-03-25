import TimeModel from "~/features/ListingFeature/Data/models/time_model";

export default class OpeningHoursModel {
  public id: number;
  public day: { id: number; title: string };
  public openingHour: TimeModel;

  constructor(
    id: number,
    day: { id: number; title: string },
    openingHour: TimeModel,
  ) {
    this.id = id;
    this.day = day;
    this.openingHour = openingHour;
  }

  static fromMap(map: { [key: string]: any }): OpeningHoursModel {
    return new OpeningHoursModel(
      map["id"],
      map["day"],
      TimeModel.fromMap(map["opening_hours"]),
    );
  }
}
