import type Params from "~/base/core/Params/params";
import axios from "axios";
import type { AxiosResponse } from "axios";
import NetworkService from "~/base/core/networkStructure/networking/network_service";
import type ServiceCallParams from "~/base/core/Params/call_params_interface";
import ShowLoader from "~/base/persention/Dialogs/LoaderDialogs/loader";
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
  UnKnownException,
} from "~/base/core/Constance/exception_constants";

enum CrudType {
  FormData = "formData",
  POST = "post",
  GET = "get",
}

// Define the ServicesInterface
export default abstract class ServicesInterface {
  private networkService = NetworkService.instance;

  async call({
    url,
    type,
    auth = false,
    forceRefresh = false,
    showLoadingDialog = false,
    headers,
    params,
    formData = false,
    details,
  }: ServiceCallParams): Promise<{ data: any; statusCode: number }> {
    let response: AxiosResponse | undefined;
    if (showLoadingDialog) {
      ShowLoader.getInstance().showLoader();

      // TODO : Fire Loader
    }
    try {
      switch (type) {
        case CrudType.FormData:
          response = await this.networkService.postFormData({
            url: url,
            data: params?.toMap() ?? {},
            headers: headers,
            queryParams: details ?? {},
            isAuth: auth,
          });
          break;
        case CrudType.POST:
          response = await this.networkService.post({
            url: url,
            data: params?.toMap() ?? {},
            headers: headers,
            queryParams: details ?? {},
            isAuth: auth,
          });
          break;
        case CrudType.GET:
          response = await this.networkService.get({
            url: url,
            headers: headers,
            queryParams: details,
            isAuth: auth,
          });
          break;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data.message;
        switch (statusCode) {
          case 400:
            console.error(`BadRequestException >> ${message}`);
            throw new BadRequestException(message);
          case 401:
            console.error(`UnAuthorizedException >> ${message}`);
            throw new UnAuthorizedException(message);
          case 403:
            console.error(`ForbiddenException >> ${statusCode}`);
            throw new ForbiddenException("Forbidden");
          case 404:
            console.error(`NotFoundException >> ${statusCode}`);
            throw new NotFoundException("Not found");
          case 405:
            console.error(`MethodNotAllowedException >> ${statusCode}`);
            throw new MethodNotAllowedException("Method not allowed");
          case 406:
            console.error(`NotAcceptableException >> ${statusCode}`);
            throw new NotAcceptableException("Not acceptable");
          case 408:
            console.error(`RequestTimeoutException >> ${statusCode}`);
            throw new RequestTimeoutException("Request timeout");
          case 422:
          { console.error(`ConflictException >> ${statusCode}`);
            const errors = error.response?.data.errors;
            let message = "Validation error";
            if (Array.isArray(errors)) {
              message = errors.join("\n");
            } else if (errors && typeof errors === "object") {
              message = Object.values(errors)
                  .flat()
                  .join("\n");
            }
            throw new ConflictException(message); }
          case 409:
            console.error(`ConflictException >> ${statusCode}`);
            throw new ConflictException("Conflict");
          case 500:
            console.error(`InternalServerException >> ${statusCode}`);
            throw new InternalServerException(message ?? "Internal server error");
          case 501:
            console.error(`NotImplementedException >> ${statusCode}`);
            throw new NotImplementedException("Not implemented");
          case 502:
            console.error(`BadGatewayException >> ${statusCode}`);
            throw new BadGatewayException("Bad gateway");
          case 503:
            console.error(`ServiceUnavailableException >> ${statusCode}`);
            throw new ServiceUnavailableException("Service unavailable");
          case 504:
            console.error(`GatewayTimeoutException >> ${statusCode}`);
            throw new GatewayTimeoutException("Gateway timeout");
          default:
            console.error(`UnKnownException >> ${statusCode}`);
            throw new UnKnownException("Unknown error");
        }
      } else {
        console.error("UnKnownException");
        throw new UnKnownException("Unknown error");
      }
    } finally {
      if (showLoadingDialog) {
        ShowLoader.getInstance().hideLoader();
        // TODO : Close Loader
      }
    }

    if (response) {
      // console.log(`Response is not null ${response.data} - ${response.status}`);
      return {
        data: response.data,
        statusCode: response.status,
      };
    } else {
      console.error("Response is null");
      throw new UnKnownException("Unknown error");
    }
  }

  abstract applyService(
    params: Params | {},
  ): Promise<{ data: any; statusCode: number }>;
}
