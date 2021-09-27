/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type CreateSizeChartRequest = {
  readonly name: string;
  readonly gender_category: number;
  readonly unit: number;
  readonly measurements_list: string;
};

export type CreateSizeChartResponse = {
  readonly id: string;
};

export const createSizeChart = (
  args: CreateSizeChartRequest,
): MerchantAPIRequest<CreateSizeChartRequest, CreateSizeChartResponse> =>
  new MerchantAPIRequest("size-chart/create", args);

export type UpdateSizeChartRequest = {
  readonly id: string;
  readonly name: string;
  readonly gender_category: number;
  readonly unit: number;
  readonly measurements_list: string;
};

export type UpdateSizeChartResponse = {
  readonly id: string;
};

export const updateSizeChart = (
  args: UpdateSizeChartRequest,
): MerchantAPIRequest<UpdateSizeChartRequest, UpdateSizeChartResponse> =>
  new MerchantAPIRequest("size-chart/update", args);

export type GetSizeChartRequest = {
  readonly sizechart: string;
};

export type GetSizeChartResponse = {
  readonly id: string;
  readonly name: string;
  readonly gender_category: number;
  readonly unit: number;
  readonly measurements_list: string;
};

export const getSizeChart = (
  args: GetSizeChartRequest,
): MerchantAPIRequest<GetSizeChartRequest, GetSizeChartResponse> =>
  new MerchantAPIRequest("size-chart/get", args);
