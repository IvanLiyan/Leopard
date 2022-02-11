/* eslint-disable @typescript-eslint/no-unused-vars */
/*
  This version of core/api only supports basic REST endpoints such as
  user/password-score, merchants/merchant-uniqueness, etc.

  THIS CONVERSION IS UNTESTED [lliepert].
  WILL TEST ONCE WE HAVE LEOPARD RUNNING AND THE INFRASTRUCTURE TO MAKE THESE CALLS FROM PAGES.
*/

import { isDev } from "@stores/EnvironmentStore";
import { i18n } from "@legacy/core/i18n";
import { absURL } from "@legacy/core/url";

const get = (
  method: string,
  callback: unknown,
  errorCallback: unknown,
  data?: unknown,
  selector?: unknown,
  num_retries?: unknown,
): never => {
  throw "Not Implemented";
};

const put = (
  method: string,
  params: unknown,
  callback: unknown,
  errorCallback: unknown,
  data?: unknown,
  selector?: unknown,
  num_retries?: unknown,
): never => {
  throw "Not Implemented";
};

const patch = (
  method: string,
  params: unknown,
  callback: unknown,
  errorCallback: unknown,
  data?: unknown,
  selector?: unknown,
  num_retries?: unknown,
): never => {
  throw "Not Implemented";
};

const post = (
  method: string,
  params: unknown,
  callback: unknown,
  errorCallback: unknown,
  data?: unknown,
  selector?: unknown,
  num_retries?: unknown,
): never => {
  throw "Not Implemented";
};

const api = {
  get: get,
  put: put,
  patch: patch,
  /* use call for "post" calls */
  call: post,
};

export default api;
