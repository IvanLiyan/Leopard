/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetBoundWishpostSettingsRequest = {};

export type GetBoundWishpostSettingsResponse = {
  readonly bind_info: ReadonlyArray<{}> | null | undefined;
};

export const getBoundWishpostSettings = (): MerchantAPIRequest<
  GetBoundWishpostSettingsRequest,
  GetBoundWishpostSettingsResponse
> => new MerchantAPIRequest("settings/get-bound-wishpost", {});
