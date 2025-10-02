import type TitleModel from "~/base/core/Models/title_model";
import type TeacherModel from "~/features/FetchCourseDetails/Data/models/teacher_model";

export default class OnlinePaymentModel {
  public id: number;
  public title: string;
  public subtitle: string;
  public url: string;
  public image: {
    img: string;
    alt: string;
  };

  constructor(
    id: number,
    title: string,
    subtitle: string,
    url: string,
    image: {
      img: string;
      alt: string;
    }
  ) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.url = url;
    this.image = image;
  }

  static fromMap(map: { [key: string]: any }): OnlinePaymentModel {
    return new OnlinePaymentModel(
      map["id"],
      map["title"],
      map["subtitle"],
      map["url"],
      map["image"]
    );
  }
}
