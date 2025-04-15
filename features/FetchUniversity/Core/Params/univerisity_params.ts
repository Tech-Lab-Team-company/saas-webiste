import type Params from "~/base/core/Params/params";

export default class UniversityParams implements Params {
  public EducationTypeId: number;
  public CountryId: number;

  constructor(
    EducationTypeId: number,
    CountryId: number,
    
  ) {
    this.EducationTypeId = EducationTypeId;
    this.CountryId = CountryId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["education_type_id"] = this.EducationTypeId;
    data["country_id"] = this.CountryId;
    return data;
  }
}
