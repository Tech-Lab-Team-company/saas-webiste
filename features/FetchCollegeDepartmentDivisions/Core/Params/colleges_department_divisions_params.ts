import type Params from "~/base/core/Params/params";

export default class CollegeDetpartmentDivisionsParams implements Params {
  public DepartmentId: number;

  constructor(
    DepartmentId: number,
    
  ) {
    this.DepartmentId = DepartmentId;

  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    data["department_id"] = this.DepartmentId;
    return data;
  }
}
