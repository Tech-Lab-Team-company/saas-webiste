import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";
import type SessionsModel from "./sessions_model";
import type TitleModel from "~/base/core/Models/title_model";


export default class ExamsModel {
  public id: number;
  public title: string;
  public StrartTime: string;
  public EndTime: string;
  public date: string;
  public ExamMark: number;
  public isFinished: boolean;
  public Mark: number;
  public Subject: TitleModel[];
  public degree_type: number;





  constructor(
    id: number,
    title: string,
    StrartTime: string,
    EndTime: string,
    date: string,
    ExamMark: number,
    isFinished: boolean,
    Mark: number,
    Subject: TitleModel[],
    degree_type: number,


  ) {
    this.id = id;
    this.title = title;
    this.StrartTime = StrartTime;
    this.EndTime = EndTime;
    this.date = date;
    this.ExamMark = ExamMark;
    this.isFinished = isFinished;
    this.Mark = Mark;
    this.Subject = Subject;
    this.degree_type = degree_type;
 
  }


  static fromMap(map: { [key: string]: any }): ExamsModel {
    return new ExamsModel(
      map["id"],
      map["title"],
      map["start_time"],
      map["end_time"],
      map["date"],
      map["exam_mark"],
      map["is_finished"],
      map["mark"],
      map["subject"],
      map["degree_type"],

    );
  }
}


// "id": 225,
// "title": "",
// "start_time": "2024-10-05 20:28:00",
// "end_time": "2024-10-06 22:24:00",
// "date": "2024-10-05",
// "exam_mark": 30,
// "is_finished": false,
// "mark": 0,
// "subject": {
//     "id": 2873,
//     "title": "رياضة 1"
// }
            
             
                 
        

                      
                