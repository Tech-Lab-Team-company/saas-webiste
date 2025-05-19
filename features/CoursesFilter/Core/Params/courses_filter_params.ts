import type Params from "@/base/core/Params/params";


export default class CoursesFilterParams implements Params {
    CategoryId: number;
    Type: number |null;
    EduicationType: number;
    StageId: number |null;
    YearId: number |null;
    SubjectId: number |null;
    UniversityId: number;
    CollegeId: number;
    DepartmentId: number;
    DivisionId: number;
    UniversitySubjectId: number;


  constructor(
    CategoryId: number,
    Type: number |null,
    EduicationType: number,
    StageId: number |null,
    YearId: number |null,
    SubjectId: number |null,
    UniversityId: number,
    CollegeId: number,
    DepartmentId: number,
    DivisionId: number,
    UniversitySubjectId: number,


  ) {
    this.CategoryId = CategoryId;
    this.Type = Type;
    this.EduicationType = EduicationType;
    this.StageId = StageId;
    this.YearId = YearId;
    this.SubjectId = SubjectId;
    this.UniversityId = UniversityId;
    this.CollegeId = CollegeId;
    this.DepartmentId = DepartmentId;
    this.DivisionId = DivisionId;
    this.UniversitySubjectId = UniversitySubjectId;


  }

  toMap(): { [p: string]: any } {
    const data: { [p: string]: any } = {};
     data["category_id"] = this.CategoryId
     data["type"] = this.Type
     data["education_type_id"] = this.EduicationType
     if(this.StageId){data["stage_id"] = this.StageId}
     data["year_id"] = this.YearId
     data["subject_id"] = this.SubjectId
     data["university_id"] = this.UniversityId
     data["college_id"] = this.CollegeId
     data["department_id"] = this.DepartmentId
     data["division_id"] = this.DivisionId
     data["university_subject_id"] = this.UniversitySubjectId
    return data;
  }
}
