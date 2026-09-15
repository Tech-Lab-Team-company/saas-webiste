export interface SecurityDataModel {
  secure?: number;
  is_flipbook?: number;
  code_duration?: number;
  is_fixed?: number;
  show_video_code?: number;
  code_font_size?: number;
  open_pdf_type?: number;
  download_option?: number;
  can_download_offline?: number;
  can_save_to_device?: number;
  long_video?: boolean;
}

export default class SessionsModel {
  public id: number;
  public LessonId: number;
  public title: string;
  public text: string;
  public type: number;
  public link: string;
  public isPaid: boolean;
  public exam: string;
  public hasExam: boolean;
  public StratDate: string;
  public EndDate: string;
  public Secure: number;
  public web_show_video: boolean;
  public security_data?: SecurityDataModel;

  constructor(
    id: number,
    LessonId: number,
    title: string,
    text: string,
    type: number,
    link: string,
    isPaid: boolean,
    exam: string,
    hasExam: boolean,
    StratDate: string,
    EndDate: string,
    Secure: number,
    web_show_video: boolean,
    security_data?: SecurityDataModel,
  ) {
    this.id = id;
    this.LessonId = LessonId;
    this.title = title;
    this.text = text;
    this.type = type;
    this.link = link;
    this.isPaid = isPaid;
    this.exam = exam;
    this.hasExam = hasExam;
    this.StratDate = StratDate;
    this.EndDate = EndDate;
    this.Secure = Secure;
    this.web_show_video = web_show_video;
    this.security_data = security_data;
  }

  static fromMap(map: { [key: string]: any }): SessionsModel {
    return new SessionsModel(
      map["id"],
      map["lesson_id"],
      map["title"],
      map["text"],
      map["type"],
      map["link"],
      map["is_paid"],
      map["exam"],
      map["has_exam"],
      map["start_date"],
      map["end_date"],
      map["secure"],
      map["web_show_video"],
      map["security_data"],
    );
  }
}




      



