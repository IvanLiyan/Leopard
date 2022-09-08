/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetBrandPerformanceOverviewMetcisParams = {
  readonly start_date: string;
  readonly end_date: string;
};

export type ChartDataEntry = {
  readonly date: number;
  readonly gmv: number;
  readonly orders: number;
  readonly impressions: number;
};

export type BrandDataEntry = {
  readonly brand_id: string;
  readonly brand_name: string;
  readonly is_abs: boolean;
  readonly gmv: number;
  readonly orders: number;
  readonly impressions: number;
  readonly products: number;
};

export type GetBrandPerformanceOverviewMetcisResponse = {
  readonly total_gmv: number;
  readonly total_orders: number;
  readonly total_impressions: number;
  readonly chart_data: ReadonlyArray<ChartDataEntry>;
  readonly brand_data: ReadonlyArray<BrandDataEntry>;
};

export const getBrandPerformanceOverviewMetcis = (
  args: GetBrandPerformanceOverviewMetcisParams
): MerchantAPIRequest<
  GetBrandPerformanceOverviewMetcisParams,
  GetBrandPerformanceOverviewMetcisResponse
> =>
  new MerchantAPIRequest(
    "branded-product/overview/get-brand-performance-metrics",
    args
  );
