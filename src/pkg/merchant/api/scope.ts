/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type ApiScopeWithDescription = {
  readonly scopes: string;
  readonly description: string;
};

export type GetAllApiScopeStringsResponse = {
  readonly results: ReadonlyArray<ApiScopeWithDescription>;
};

export const getAllApiScopeStrings = (): MerchantAPIRequest<
  {},
  GetAllApiScopeStringsResponse
> => new MerchantAPIRequest("scopes_documentation/get");
