/* External Libraries */
import { OpenAPISpec } from "redoc/typings/types";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetOpenApiSpecResponse = {
  readonly results: OpenAPISpec;
  readonly info: any;
};

export type GetOpenApiSpecParams = {
  readonly parsed?: boolean;
};

export const getOpenApiSpec = (
  args: GetOpenApiSpecParams
): MerchantAPIRequest<GetOpenApiSpecParams, GetOpenApiSpecResponse> =>
  new MerchantAPIRequest("openapi_spec/get", args);
