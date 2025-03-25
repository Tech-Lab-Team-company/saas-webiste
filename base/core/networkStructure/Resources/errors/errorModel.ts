enum ErrorType {
  serviceSide,
  networkConnection,
  dataEmpty,
  dataDirty,
  unknown,
  badRequest = 5,
  unAuthorized = 6,
  methodNotAllowed = 7,
}

class ErrorModel {
  public title: string;
  public type: ErrorType = ErrorType.unknown;

  constructor(title: string, type: ErrorType) {
    this.title = title;
    this.type = type;
  }
}

export { ErrorModel, ErrorType };
