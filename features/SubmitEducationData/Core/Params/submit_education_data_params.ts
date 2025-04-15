import type Params from "~/base/core/Params/params";

export default class SubmitEducationDataParams implements Params {
  public UniversityEducationTypeId: number;
  public DivisionId: number;
  public CategoryId: number;
  public UniversityId: number;
  public CollegeId: number;
  public DepartmentId: number;

  constructor(
    UniversityEducationTypeId: number,
    DivisionId: number,
    CategoryId: number,
    UniversityId: number,
    CollegeId: number,
    DepartmentId: number,
    
  ) {
    this.UniversityEducationTypeId = UniversityEducationTypeId;
    this.DivisionId = DivisionId;
    this.CategoryId = CategoryId;
    this.UniversityId = UniversityId;
    this.CollegeId = CollegeId;
    this.DepartmentId = DepartmentId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["university_education_type_id"] = this.UniversityEducationTypeId;
    data["division_id"] = this.DivisionId;
    data["category_id"] = this.CategoryId;
    data["university_id"] = this.UniversityId;
    data["college_id"] = this.CollegeId;
    data["department_id"] = this.DepartmentId;
    return data;
  }
}
