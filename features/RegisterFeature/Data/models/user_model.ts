export default class UserModel {
  public id: number;
  public email: string;
  public phone: string;
  public name: string;
  public CategoryId: number;
  public CountryId: number;
  public NationalityId: number;
  public CountryCode: string;
  public VerificationCode: string;
  public TeacherId: number;
  public UpdatedAt: string;
  public CreatedAt: string;
  public Token: string;
  public ImageLink: string;
  public CreatedAtFormat: string;
  public IsInfoComplete: number;
  public UserInformation: string;
  

  constructor(
    id: number,
    email: string,
    phone: string,
    name: string,
    CategoryId: number,
    CountryId: number,
    NationalityId: number,
    CountryCode: string,
    VerificationCode: string,
    TeacherId: number,
    UpdatedAt: string,
    CreatedAt: string,
    Token: string,
    ImageLink: string,
    CreatedAtFormat: string,
    IsInfoComplete: number,
    UserInformation: string,



  ) {
    this.id = id;
    this.email = email;
    this.phone = phone;
    this.name = name;
    this.CategoryId = CategoryId;
    this.CountryId = CountryId;
    this.NationalityId = NationalityId;
    this.CountryCode = CountryCode;
    this.VerificationCode = VerificationCode;
    this.TeacherId = TeacherId;
    this.UpdatedAt = UpdatedAt;
    this.CreatedAt = CreatedAt;
    this.Token = Token;
    this.ImageLink = ImageLink;
    this.CreatedAtFormat = CreatedAtFormat;
    this.IsInfoComplete = IsInfoComplete;
    this.UserInformation = UserInformation;
  }

  static fromMap(map: { [key: string]: any }): UserModel {
    return new UserModel(
      map["email"],
      map["phone"],
      map["name"],
      map["category_id"],
      map["country_id"],
      map["nationality_id"],
      map["country_code"],
      map["verification_code"],
      map["teacher_id"],
      map["updated_at"],
      map["created_at"],
      map["id"],
      map["token"],
      map["image_link"],
      map["created_at_format"],
      map["is_info_complete"],
      map["user_information"],

    );
  }
}

