import type MediaInterfaceParams from "../../Core/Params/media_interface_params"
import type SubjectModel from "./subject_model_interfcae"
import type TeacherModel from "./teacher_model"

export default class CoursesFilterModel {
    public id: number
    public title: string
    public description: string
    public image: MediaInterfaceParams[]
    public course_price: number
    public subject: SubjectModel
    public intro: string
    public teacher: TeacherModel;
    public course_videos: number;
    public course_docs: number;
    public course_records: number

    constructor(
      id: number,
      title: string,
      description: string,
      image: MediaInterfaceParams[],
      course_price: number,
      subject: SubjectModel,
      intro: string,
      teacher: TeacherModel,
      course_videos: number,
      course_docs: number,
      course_records: number,

    ) {
      this.id = id
      this.title = title
      this.description = description
      this.image = image
      this.course_price = course_price
      this.subject = subject
      this.intro = intro
      this.teacher = teacher
      this.course_videos = course_videos
      this.course_docs = course_docs
      this.course_records = course_records

    }

    static fromMap(data: any): CoursesFilterModel {
      return new CoursesFilterModel(
          data.id,
          data.title,
          data.description,
          data.image,
          data.course_price,
          data.subject,
          data.intro,
          data.teacher,
          data.course_videos,
          data.course_docs,
          data.course_records,

      )
    }
  }







