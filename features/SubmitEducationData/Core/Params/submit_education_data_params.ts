import type Params from "~/base/core/Params/params";

export default class SubmitEducationDataParams implements Params {
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
    UniversityEducationTypeId: number  | null ,
    DivisionId: number | null,
    CategoryId: number | null,
    UniversityId: number | null,
    CollegeId: number | null,
    DepartmentId: number | null,
    YearId: number | null,
    EducationTypeId: number | null,
    StageId: number | null,
    
  ) {
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
    const data: { [key: string]: any } = {};
    if(this.UniversityEducationTypeId) data["university_education_type_id"] = this.UniversityEducationTypeId;
    if(this.DivisionId) data["division_id"] = this.DivisionId;
    if(this.CategoryId) data["category_id"] = this.CategoryId;
    if(this.UniversityId) data["university_id"] = this.UniversityId;
    if(this.CollegeId) data["college_id"] = this.CollegeId;
    if(this.DepartmentId) data["department_id"] = this.DepartmentId;
    if(this.YearId) data["year_id"] = this.YearId;
    if(this.EducationTypeId) data["basic_education_type_id"] = this.EducationTypeId;
    if(this.StageId) data["stage_id"] = this.StageId;
    return data;
  }
}
