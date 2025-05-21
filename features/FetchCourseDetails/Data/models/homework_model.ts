import type MediaInterface from "~/types/media";
import type TitleInterface from "~/types/title_intefrace";
import type AttachmentModel from "./attachment_model";

export default class HomeWorkModel {
  public attachments: AttachmentModel[];
  public course: TitleInterface; // id - title
  public description: string; 
  public end_time: string; 
  public id: number; 
  public is_active: number; 
  public start_time: string; 
  public teacher: TitleInterface; 
  public text: string; 
  public title: string; 

  constructor(
    attachments: AttachmentModel[],
    course: TitleInterface,
    description: string,
    end_time: string,
    id: number,
    is_active: number,
    start_time: string,
    teacher: TitleInterface,
    text: string,
    title: string,

  ) {
    this.attachments = attachments;
    this.course = course;
    this.description = description;
    this.end_time = end_time;
    this.id = id;
    this.is_active = is_active;
    this.start_time = start_time;
    this.teacher = teacher;
    this.text = text;
    this.title = title;
 
  }


  static fromMap(map: { [key: string]: any }): HomeWorkModel {
    return new HomeWorkModel(
      map["attachments"],
      map["course"],
      map["description"],
      map["end_time"],
      map["id"],
      map["is_active"],
      map["start_time"],
      map["teacher"],
      map["text"],
      map["title"],
    );
  }
}
