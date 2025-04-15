import ReplayModel from "~/features/MakeCommentFeature/Data/models/replay_model";

export default class UserModel {
  public id: number;
  public name: string; // Use 'string' instead of 'String'
  public phone: string; // Use 'string' instead of 'String'
  public CountryCode: string; // Use 'string' instead of 'String'
  public Email: string; // Use 'string' instead of 'String'
  public Address: string; // Use 'string' instead of 'String'
  public Image: string; // Use 'string' instead of 'String'
  public VerificationCode : string; // Use 'string' instead of 'String'
  public CategoryId : number; // Use 'string' instead of 'String'
  public CategoryTitle : string; // Use 'string' instead of 'String'
  public Type : string; // Use 'string' instead of 'String'
  public UserInfo : string; // Use 'string' instead of 'String'
  public DeviceToken : string; // Use 'string' instead of 'String'
  public IsDeviceEmulator : number; // Use 'string' instead of 'String'
  public Gender : string; // Use 'string' instead of 'String'
  public Token : string; // Use 'string' instead of 'String'


  constructor(
    id: number,
    name: string,
    phone: string,
    CountryCode: string,
    Email: string,
    Address: string,
    Image: string,
    VerificationCode: string,
    CategoryId: number,
    CategoryTitle: string,
    Type: string,
    UserInfo: string,
    DeviceToken: string,
    IsDeviceEmulator: number,
    Gender: string,
    Token: string,

  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.CountryCode = CountryCode;
    this.Email = Email;
    this.Address = Address;
    this.Image = Image;
    this.VerificationCode = VerificationCode;
    this.CategoryId = CategoryId;
    this.CategoryTitle = CategoryTitle;
    this.Type = Type;
    this.UserInfo = UserInfo;
    this.DeviceToken = DeviceToken;
    this.IsDeviceEmulator = IsDeviceEmulator;
    this.Gender = Gender;
    this.Token = Token;
 
  }


  static fromMap(map: { [key: string]: any }): UserModel {
    return new UserModel(
      map["id"],
      map["name"],
      map["phone"],
      map["CountryCode"],
      map["Email"],
      map["Address"],
      map["Image"],
      map["VerificationCode"],
      map["CategoryId"],
      map["CategoryTitle"],
      map["Type"],
      map["UserInfo"],
      map["DeviceToken"],
      map["IsDeviceEmulator"],
      map["Gender"],
      map["Token"],
    );
  }
}


