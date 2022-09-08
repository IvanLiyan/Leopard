/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetLineItemsParams = {};

export type GetLineItemsResponse = {};

export const getLineItems = (
  args: GetLineItemsParams
): MerchantAPIRequest<GetLineItemsParams, GetLineItemsResponse> =>
  new MerchantAPIRequest("line-item/get", args);
