/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Merchant API */
import { GetFBWStatsParams, GetFBWStatsResponse } from "@merchant/api/fbw";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetFBWShippingPriceDropListParams = {
  readonly warehouse_id?: string;
  readonly state?: number;
};

export type GetFBWShippingPriceDropListResponse = {
  readonly accepted: ReadonlyArray<VariationShippingPrices>;
  readonly pending: ReadonlyArray<VariationShippingPrices>;
  readonly currency: "USD" | "CNY";
};

export type ShippingPrice = {
  readonly current: number;
  readonly suggested: number;
};

export type CountryShippingPrices = {
  [country_code in CountryCode]: ShippingPrice;
};

export type CountryShippingPrice = {
  readonly country: CountryCode;
  readonly suggested: number;
  readonly current: number;
};

export type VariationShippingPrices = {
  readonly product_id: string;
  readonly variation_id: string;
  readonly warehouse_id: string;
  readonly sku?: string;
  readonly timestamp?: string;
  readonly shipping_prices: CountryShippingPrices;
};

export type AcceptFBWShippingPriceDropsParams = {
  shipping_drops: string; // stringified ReadonlyArray<VariationShippingPrices>
  currency: string;
};

export type RejectFBWShippingPriceDropParams = {
  readonly variation_id: string;
  readonly warehouse_id: string;
  readonly product_id: string;
};

type EmptyResponse = {};

export const getShippingPriceDrops = (
  args: GetFBWShippingPriceDropListParams
): MerchantAPIRequest<
  GetFBWShippingPriceDropListParams,
  GetFBWShippingPriceDropListResponse
> => new MerchantAPIRequest("fbw/shipping-price-drop", args);

export const rejectShippingPriceDrop = (
  args: RejectFBWShippingPriceDropParams
): MerchantAPIRequest<RejectFBWShippingPriceDropParams, EmptyResponse> =>
  new MerchantAPIRequest("fbw/shipping-price-drop/reject", args);

export const acceptShippingPriceDrops = (
  args: AcceptFBWShippingPriceDropsParams
): MerchantAPIRequest<AcceptFBWShippingPriceDropsParams, EmptyResponse> =>
  new MerchantAPIRequest("fbw/shipping-price-drop/accept", args);

export const getFBWStats = (
  args: GetFBWStatsParams
): MerchantAPIRequest<GetFBWStatsParams, GetFBWStatsResponse> =>
  new MerchantAPIRequest("fbw/all-summary/get", args);
