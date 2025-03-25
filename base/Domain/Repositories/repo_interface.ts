import {
  DataEmpty,
  DataFailed,
  DataState,
  DataSuccess,
} from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/Params/params";
import { HttpStatusCode } from "axios";
import {
  ErrorModel,
  ErrorType,
} from "@/base/core/networkStructure/Resources/errors/errorModel";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";
import PaginationModel from "@/base/core/Models/pagination_model";
import {
  BadRequestException,
  ForbiddenException,
  NetworkDisconnectException,
  UnAuthorizedException,
  NotFoundException,
  MethodNotAllowedException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  InternalServerException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
} from "@/base/core/Constance/exception_constants";

export enum ResponseType {
  withData,
  withoutData,
}

// Define your base repository interface
export default abstract class RepoInterface<T> {
  // Getter for your service instance (you need to implement this in a concrete class)
  abstract get serviceInstance(): ServicesInterface;

  get responseType(): ResponseType {
    return ResponseType.withData;
  }

  abstract onParse(data: any): T;

  get hasPagination(): boolean {
    return false;
  }

  async call(params: Params | {} = {}): Promise<DataState<T>> {
    try {
      const httpResponse = await this.serviceInstance.applyService(params);
      // console.log(httpResponse)
      const checkResponse =
        ([
          HttpStatusCode.Ok,
          HttpStatusCode.Created,
          HttpStatusCode.Accepted,
        ].includes(httpResponse.statusCode) &&
          httpResponse.data.status) ??
        true;
      if (checkResponse) {
        if (this.responseType === ResponseType.withoutData) {
          // console.log("elsayed")
          return new DataSuccess<T>({
            data: null,
            message: httpResponse.data.message,
          });
        }

        if (httpResponse.data.data != null) {
          try {
            let pagination: PaginationModel | null = null;
            if (this.hasPagination && httpResponse.data.data.meta) {
              console.log(httpResponse.data.data.data.length);
              if (httpResponse.data.data.data.length === 0) {
                return new DataEmpty<T>(
                  new ErrorModel(
                    httpResponse.data.message ?? "",
                    ErrorType.dataEmpty,
                  ),
                );
              }
              // console.log(httpResponse.data.data.meta);
              pagination = PaginationModel.fromMap(httpResponse.data.data.meta);
            }

            //check if data is list and lenth is 0
            if (
              Array.isArray(httpResponse.data.data) &&
              httpResponse.data.data.length === 0
            ) {
              return new DataEmpty<T>(
                new ErrorModel(
                  httpResponse.data.message ?? "",
                  ErrorType.dataEmpty,
                ),
              );
            }
            // console.log(httpResponse.data.data.listings)

            return new DataSuccess<T>({
              data: this.onParse(
                this.hasPagination
                  ? httpResponse.data.data.data
                  : httpResponse.data.data,
              ),
              pagination: httpResponse.data.data.listings
                ? httpResponse.data.data.listings.meta
                : pagination,
              message: httpResponse.data.message,
            });
          } catch (e) {
            console.error("Error parsing data from Repo", e);
            return new DataFailed({
              error: new ErrorModel(
                httpResponse.data.message ?? "",
                ErrorType.dataDirty,
              ),
            });
          }
        } else {
          return new DataFailed({
            error: new ErrorModel(
              httpResponse.data.message ?? "",
              ErrorType.dataEmpty,
            ),
          });
        }
      }
      console.error("Error response data", httpResponse.data);
      return new DataFailed({
        error: new ErrorModel(
          httpResponse.data.message ?? "",
          ErrorType.serviceSide,
        ),
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Handle different exception types
  private handleError(error: any): DataFailed<T> {
    if (error instanceof BadRequestException) {
      return new DataFailed({
        error: new ErrorModel(error.message, ErrorType.badRequest),
      });
    } else if (error instanceof ForbiddenException) {
      return new DataFailed({
        error: new ErrorModel(error.message, ErrorType.serviceSide),
      });
    } else if (error instanceof NetworkDisconnectException) {
      return new DataFailed({
        error: new ErrorModel(
          "Network Disconnected",
          ErrorType.networkConnection,
        ),
      });
    } else if (error instanceof UnAuthorizedException) {
      return new DataFailed({
        error: new ErrorModel("Unauthorized", ErrorType.unAuthorized),
      });
    } else if (error instanceof NotFoundException) {
      return new DataFailed({
        error: new ErrorModel("Not Found", ErrorType.unknown),
      });
    } else if (error instanceof MethodNotAllowedException) {
      return new DataFailed({
        error: new ErrorModel("Method Not Allowed", ErrorType.methodNotAllowed),
      });
    } else if (error instanceof NotAcceptableException) {
      return new DataFailed({
        error: new ErrorModel("Not Acceptable", ErrorType.unknown),
      });
    } else if (error instanceof RequestTimeoutException) {
      return new DataFailed({
        error: new ErrorModel("Request Timeout", ErrorType.unknown),
      });
    } else if (error instanceof ConflictException) {
      return new DataFailed({
        error: new ErrorModel(error.message, ErrorType.unknown),
      });
    } else if (error instanceof InternalServerException) {
      return new DataFailed({
        error: new ErrorModel(error.message, ErrorType.unknown),
      });
    } else if (error instanceof NotImplementedException) {
      return new DataFailed({
        error: new ErrorModel("Not Implemented", ErrorType.unknown),
      });
    } else if (error instanceof BadGatewayException) {
      return new DataFailed({
        error: new ErrorModel("Bad Gateway", ErrorType.unknown),
      });
    } else if (error instanceof ServiceUnavailableException) {
      return new DataFailed({
        error: new ErrorModel("Service Unavailable", ErrorType.unknown),
      });
    } else if (error instanceof GatewayTimeoutException) {
      return new DataFailed({
        error: new ErrorModel("Gateway Timeout", ErrorType.unknown),
      });
    } else {
      return new DataFailed({
        error: new ErrorModel(error.message, ErrorType.unknown),
      });
    }
  }
}
