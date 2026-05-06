import type Params from "~/base/core/Params/params";

export default class UpdateProfileParams implements Params {
  public firstName: string | null;
  public lastName: string | null;
  public name: string | null;
  public email: string | null;
  public phone: string | null;
  public type: number | null;
  public aboutMe: string | null;
  public sendNotifications: boolean | null;
  public facebook: string | null;
  public x: string | null;
  public instagram: string | null;
  public youtube: string | null;
  public linkedin: string | null;
  public whatsapp: string | null;
  public UniversityEducationTypeId: number | null;
  public DivisionId: number | null;
  public CategoryId: number | null;
  public UniversityId: number | null;
  public CollegeId: number | null;
  public DepartmentId: number | null;
  public YearId: number | null;
  public EducationTypeId: number | null;
  public StageId: number | null;

  constructor(
    firstName: string | null,
    lastName: string | null,
    name: string | null,
    email: string | null,
    phone: string | null,
    type: number | null,
    aboutMe: string | null,
    sendNotifications: boolean | null,
    facebook: string | null,
    x: string | null,
    instagram: string | null,
    youtube: string | null,
    linkedin: string | null,
    whatsapp: string | null,
    UniversityEducationTypeId: number | null,
    DivisionId: number | null,
    CategoryId: number | null,
    UniversityId: number | null,
    CollegeId: number | null,
    DepartmentId: number | null,
    YearId: number | null,
    EducationTypeId: number | null,
    StageId: number | null,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.aboutMe = aboutMe;
    this.sendNotifications = sendNotifications;
    this.facebook = facebook;
    this.x = x;
    this.instagram = instagram;
    this.youtube = youtube;
    this.linkedin = linkedin;
    this.whatsapp = whatsapp;
    this.UniversityEducationTypeId = UniversityEducationTypeId;
    this.DivisionId = DivisionId;
    this.CategoryId = CategoryId;
    this.UniversityId = UniversityId;
    this.CollegeId = CollegeId;
    this.DepartmentId = DepartmentId;
    this.YearId = YearId;
    this.EducationTypeId = EducationTypeId;
    this.StageId = StageId;
  }

  toMap(): { [key: string]: any } {
    // return {
    //   first_name: this.firstName,
    //   last_name: this.lastName,
    //   email: this.email,
    //   phone: this.phone,
    //   name: this.name,
    //   about_me: this.aboutMe,
    //   send_notifications: this.sendNotifications ? 1 : 0,
    //   social: {
    //     facebook: this.facebook,
    //     x: this.x,
    //     instagram: this.instagram,
    //     youtube: this.youtube,
    //     linkedin: this.linkedin,
    //     whatsapp: this.whatsapp,
    //   },
    //   university_education_type_id: this.UniversityEducationTypeId,
    //   division_id: this.DivisionId,
    //   category_id: this.CategoryId,
    //   university_id: this.UniversityId,
    //   college_id: this.CollegeId,
    //   department_id: this.DepartmentId,
    //   year_id: this.YearId,
    //   basic_education_type_id: this.EducationTypeId,
    //   stage_id: this.StageId,
    // };
    const data: { [key: string]: any } = {};
    if (this.firstName) data["first_name"] = this.firstName;
    if (this.lastName) data["last_name"] = this.lastName;
    if (this.name) data["name"] = this.name;
    if (this.email) data["email"] = this.email;
    if (this.phone) data["phone"] = this.phone;
    if (this.type) data["type"] = this.type;
    if (this.aboutMe) data["about_me"] = this.aboutMe;
    if (this.sendNotifications)
      data["send_notifications"] = this.sendNotifications ? 1 : 0;
    if (this.facebook) data["facebook"] = this.facebook;
    if (this.x) data["x"] = this.x;
    if (this.instagram) data["instagram"] = this.instagram;
    if (this.youtube) data["youtube"] = this.youtube;
    if (this.linkedin) data["linkedin"] = this.linkedin;
    if (this.whatsapp) data["whatsapp"] = this.whatsapp;
    if (this.UniversityEducationTypeId)
      data["university_education_type_id"] = this.UniversityEducationTypeId;
    if (this.DivisionId) data["division_id"] = this.DivisionId;
    if (this.CategoryId) data["category_id"] = this.CategoryId;
    if (this.UniversityId) data["university_id"] = this.UniversityId;
    if (this.CollegeId) data["college_id"] = this.CollegeId;
    if (this.DepartmentId) data["department_id"] = this.DepartmentId;
    if (this.YearId) data["year_id"] = this.YearId;
    if (this.EducationTypeId)
      data["basic_education_type_id"] = this.EducationTypeId;
    if (this.StageId) data["stage_id"] = this.StageId;
    return data;
  }
}
