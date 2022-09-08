/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";
import { StateCode } from "@ContextLogic/lego/toolkit/states";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type MerchantSalesStats = {
  readonly date: string;
  readonly gmv: number;
  readonly orders: number;
  readonly quantity_sold: number;
};

export type GetMerchantStatsParams = {
  readonly stat_type: string;
};

export type GetMerchantStatsResponse = {
  readonly results: ReadonlyArray<MerchantSalesStats>;
  readonly total_gmv: number;
  readonly total_orders: number;
  readonly total_sold: number;
};

export const getMerchantStats = (
  args: GetMerchantStatsParams
): MerchantAPIRequest<GetMerchantStatsParams, GetMerchantStatsResponse> =>
  new MerchantAPIRequest("fbs/merchant-stats/get", args);

export type MerchantRegionStats = [CountryCode, number];

export type GetMerchantStatsByRegionParams = {
  readonly stat_type: string;
};

export type GetMerchantStatsByRegionResponse = {
  readonly results: {
    readonly country_list: ReadonlyArray<MerchantRegionStats>;
    readonly state_list: ReadonlyArray<[StateCode, number]>;
  };
  readonly state_dict: {
    [key: string]: number;
  };
  readonly country_dict: {
    [key: string]: number;
  };
};

export const getMerchantStatsByRegion = (
  args: GetMerchantStatsByRegionParams
): MerchantAPIRequest<
  GetMerchantStatsByRegionParams,
  GetMerchantStatsByRegionResponse
> => new MerchantAPIRequest("fbs/merchant-stats-by-region/get", args);

export type ProductVariationStats = {
  readonly merchant_id: string;
  readonly product_id: string;
  readonly variation_id: string;
  readonly product_name: string;
  readonly variation_name: string;
  readonly variation_size: string;
  readonly variation_color: string;
  readonly warehouses: ReadonlyArray<string>;
  readonly gmv: number;
  readonly orders: number;
  readonly quantity_sold: number;
  readonly inventory: number;
  readonly gmv_country_dict: {
    [country: string]: number;
  };
  readonly orders_country_dict: {
    [country: string]: number;
  };
  readonly quantity_sold_country_dict: {
    [country: string]: number;
  };
  readonly inventory_country_dict: {
    [country: string]: number;
  };
  readonly gmv_us_dict: {
    [state: string]: number;
  };
  readonly orders_us_dict: {
    [state: string]: number;
  };
  readonly quantity_sold_us_dict: {
    [state: string]: number;
  };
  readonly inventory_us_dict: {
    [state: string]: number;
  };
};

export type GetProductStatsParams = {
  readonly start_date: string;
  readonly end_date: string;
};

export type GetProductStatsResponse = {
  readonly results: ReadonlyArray<ProductVariationStats>;
};

export const getProductStats = (
  args: GetProductStatsParams
): MerchantAPIRequest<GetProductStatsParams, GetProductStatsResponse> =>
  new MerchantAPIRequest("fbs/product-stats", args);

export type FBSTopVariation = {
  readonly product_id: string;
  readonly variation_id: string;
  readonly quantity: number;
  readonly warehouse_id: string;
  readonly variation_sku: string;
  readonly total_gmv: number;
};

export type GetFBSTopVariationsResponse = {
  readonly results: ReadonlyArray<FBSTopVariation>;
};

export const getFBSTopVariations = (): MerchantAPIRequest<
  {},
  GetFBSTopVariationsResponse
> => new MerchantAPIRequest("fbs/top-variations");
