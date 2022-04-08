/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetTempAccessTokenResponse = {
  readonly access_token: string;
};

export const getTempAccessToken = (): MerchantAPIRequest<
  {},
  GetTempAccessTokenResponse
> => new MerchantAPIRequest("oauth/temp-access-token");
