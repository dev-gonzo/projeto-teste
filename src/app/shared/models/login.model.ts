import { ResponseSuccessHttp } from "./http-response.model";

export interface LoginResponse extends ResponseSuccessHttp {
  token: string;
}
