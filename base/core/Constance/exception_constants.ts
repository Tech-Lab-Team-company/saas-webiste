// Define exception classes
class ApiException extends Error {}
export class BadRequestException extends ApiException {}
export class ForbiddenException extends ApiException {}
export class NetworkDisconnectException extends ApiException {}
export class UnAuthorizedException extends ApiException {}
export class NotFoundException extends ApiException {}
export class MethodNotAllowedException extends ApiException {}
export class NotAcceptableException extends ApiException {}
export class RequestTimeoutException extends ApiException {}
export class ConflictException extends ApiException {}
export class InternalServerException extends ApiException {}
export class NotImplementedException extends ApiException {}
export class BadGatewayException extends ApiException {}
export class ServiceUnavailableException extends ApiException {}
export class GatewayTimeoutException extends ApiException {}
export class UnKnownException extends ApiException {}

