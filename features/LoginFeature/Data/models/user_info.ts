export default class UserInfo {
  public id: number;
  public basic_education_type_id: string;
  public stage_id: string;
  public year_id: string;
  public university_education_type_id: number;
  public university_id: string;
  public college_id: string;
  public department_id: string;
  public division_id: number;
  public basic_education_type_title: string;
  public stage_title: string;
  public year_title: string;
  public university_education_type_title: string;
  public university_title: string;
  public college_title: string;
  public department_title: string;
  public division_title: string;
  public failing_subjects: string[];

  constructor(
    id: number,
    basic_education_type_id: string,
    stage_id: string,
    year_id: string,
    university_education_type_id: number,
    university_id: string,
    college_id: string,
    department_id: string,
    division_id: number,
    basic_education_type_title: string,
    stage_title: string,
    year_title: string,
    university_education_type_title: string,
    university_title: string,
    college_title: string,
    department_title: string,
    division_title: string,
    failing_subjects: string[]
  ) {
    this.id = id;
    this.basic_education_type_id = basic_education_type_id;
    this.stage_id = stage_id;
    this.year_id = year_id;
    this.university_education_type_id = university_education_type_id;
    this.university_id = university_id;
    this.college_id = college_id;
    this.department_id = department_id;
    this.division_id = division_id;
    this.basic_education_type_title = basic_education_type_title;
    this.stage_title = stage_title;
    this.year_title = year_title;
    this.university_education_type_title = university_education_type_title;
    this.university_title = university_title;
    this.college_title = college_title;
    this.department_title = department_title;
    this.division_title = division_title;
    this.failing_subjects = failing_subjects || [];
  }

  static fromMap(map: { [key: string]: any }): UserInfo {
    return new UserInfo(
      map["id"],
      map["basic_education_type_id"],
      map["stage_id"],
      map["year_id"],
      map["university_education_type_id"],
      map["university_id"],
      map["college_id"],
      map["department_id"],
      map["division_id"],
      map["basic_education_type_title"],
      map["stage_title"],
      map["year_title"],
      map["university_education_type_title"],
      map["university_title"],
      map["college_title"],
      map["department_title"],
      map["division_title"],
      map["failing_subjects"] || [],

    );
  }
}

