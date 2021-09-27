/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetRefundsDataParams = {};

export type GetRefundsDataResponse = {
  readonly result_size: number;
  readonly date_range: string;
  readonly prev_date_range: string;
  readonly refund_rate: number;
  readonly prev_refund_rate: number;
};

export type GetFulfillmentDataParams = {};

export type GetFulfillmentDataResponse = {
  readonly result_size: number;
  readonly date_range: string;
  readonly prev_date_range: string;
  readonly fulfillment_time: number;
  readonly prev_fulfillment_time: number;
};

export type GetTrackingDataParams = {};

export type GetTrackingDataResponse = {
  readonly result_size: number;
  readonly date_range: string;
  readonly prev_date_range: string;
  readonly tracking_rate: number;
  readonly prev_tracking_rate: number;
};

export type GetDeliveryDataParams = {};

export type GetDeliveryDataResponse = {
  readonly result_size: number;
  readonly date_range: string;
  readonly prev_date_range: string;
  readonly delivery_rate: number;
  readonly prev_delivery_rate: number;
};

export type GetStoreDataParams = {};

export type GetStoreDataResponse = {
  readonly result_size: number;
  readonly date_range: string;
  readonly prev_date_range: string;
  readonly store_rating: number;
  readonly prev_store_rating: number;
};

export type GetCounterfeitDataParams = {};

export type GetCounterfeitDataResponse = {
  readonly result_size: number;
  readonly date_range: string;
  readonly prev_date_range: string;
  readonly counterfeit_rate: number;
  readonly prev_counterfeit_rate: number;
};

export type Correlation = "positive" | "inverse";

export type PerformanceData = {
  resultSize: number;
  dateRange: string;
  previousDate: string;
  currentValue: number;
  previousValue: number;
  correlation: Correlation;
  dataChange: string;
  trend: "up" | "down";
};

export const getStoreRatingData = (
  args: GetStoreDataParams
): MerchantAPIRequest<GetStoreDataParams, GetStoreDataResponse> =>
  new MerchantAPIRequest("performance/store", args);

export const getDeliveryRateData = (
  args: GetDeliveryDataParams
): MerchantAPIRequest<GetDeliveryDataParams, GetDeliveryDataResponse> =>
  new MerchantAPIRequest("performance/delivery", args);

export const getRefundRateData = (
  args: GetRefundsDataParams
): MerchantAPIRequest<GetRefundsDataParams, GetRefundsDataResponse> =>
  new MerchantAPIRequest("performance/refunds", args);

export const getFulfillmentTimeData = (
  args: GetFulfillmentDataParams
): MerchantAPIRequest<GetFulfillmentDataParams, GetFulfillmentDataResponse> =>
  new MerchantAPIRequest("performance/fulfillment", args);

export const getTrackingRateData = (
  args: GetTrackingDataParams
): MerchantAPIRequest<GetTrackingDataParams, GetTrackingDataResponse> =>
  new MerchantAPIRequest("performance/tracking", args);

export const getCounterfeitRateData = (
  args: GetCounterfeitDataParams
): MerchantAPIRequest<GetCounterfeitDataParams, GetCounterfeitDataResponse> =>
  new MerchantAPIRequest("performance/counterfeit", args);
