import MyExamModel from "./my_exam_model";

export default class MyExamsResource {
  constructor(
    public lastExams: MyExamModel[],
    public currentExams: MyExamModel[],
  ) {}

  static fromMap(map: Record<string, any>): MyExamsResource {
    return new MyExamsResource(
      Array.isArray(map.last_exams)
        ? map.last_exams.map(MyExamModel.fromMap)
        : [],
      Array.isArray(map.current_exams)
        ? map.current_exams.map(MyExamModel.fromMap)
        : [],
    );
  }
}
