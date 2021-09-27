/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type SelectedTab = "active" | "pending" | "ongoing" | "ended";
export type HistoryPriceDropState = "all" | "ended" | "merchant_canceled";

export type CurrencyCode = "USD" | "CNY";

export type PriceDropSearchType =
  | "product_id"
  | "product_name"
  | "product_sku"
  | "campaign_id";

export type PriceDropStatus =
  | "PENDING_ACTION"
  | "CAN_RESET"
  | "ON_GOING"
  | "EXPIRED"
  | "ENDED"
  | "MERCHANT_CANCELED"
  | "WISH_CANCELED";

export type SourceName =
  | "TRIAL"
  | "DUPLICATE_TRIAL"
  | "MERCHANT_MANUAL"
  | "CSV_UPLOAD";

export type EligibleProductsSearchType =
  | "id"
  | "name"
  | "sku"
  | "parent_sku"
  | "tags";

export type ImprBoosterItem = {
  readonly id: string;
  readonly product_id: string;
  readonly parent_sku: string;
  readonly state: number;
  readonly source_name: string;
  readonly minutes_left_to_reset: number;
  readonly original_price_min: number;
  readonly original_price_max: number;
  readonly original_localized_price_min: number;
  readonly original_localized_price_max: number;
  readonly currency_code: CurrencyCode;
  readonly new_price_min: number;
  readonly new_price_max: number;
  readonly new_localized_price_min: number;
  readonly new_localized_price_max: number;
  readonly drop_percentage: number;
  readonly min_drop_percentage: number;
  readonly max_drop_percentage: number;
  readonly drop_date_str: string;
  readonly expire_datetime_str: string | null | undefined;
  readonly total_impressions: number;
  readonly sales: number;
  readonly gmv: number;
  readonly localized_gmv: number;
  readonly start_date_str: string | null | undefined;
  readonly end_date_str: string | null | undefined;
  readonly trial_start_date_str: string;
  readonly trial_end_date_str: string;
  readonly auto_renew: boolean;
  readonly blacklisted: boolean;
  readonly is_competitive: boolean;
  readonly gmv_gain: number | null | undefined;
  readonly impression_gain: number | null | undefined;
  readonly trial_drop_percentage: number | null | undefined;
  readonly status?: PriceDropStatus;
  readonly cancel_reason?: number;
};

export type GetPriceDropRecordsParams = {
  readonly count: number;
  readonly offset: number;
  readonly state: SelectedTab;
  readonly search_type: PriceDropSearchType;
  readonly search_query: string;
  readonly history_state?: HistoryPriceDropState;
};

export type GetPriceDropRecordsResponse = {
  readonly end: number | null | undefined;
  readonly total_count: number;
  readonly has_more: boolean;
  readonly price_drop_records: ReadonlyArray<ImprBoosterItem>;
  readonly ended_count?: number;
  readonly merchant_canceled_count?: number;
};

export type DropPriceResponse = {};

export type GetDropPriceProductPerformanceParams = {
  readonly price_drop_record_id: string;
  readonly start_date: string;
  readonly end_date: string;
};

export type DropPriceDailyData = {
  readonly date: string;
  readonly gmv?: number;
  readonly sales?: number;
  readonly impressions?: number;
  readonly spend?: number;
};

export type GetDropPriceProductPerformanceResponse = {
  readonly daily_data: ReadonlyArray<DropPriceDailyData>;
  readonly show_gmv_gain: boolean;
};

export type GetDropPriceBasicInfoParams = {
  readonly price_drop_record_id: string;
};

export type GetDropPriceBasicInfoResponse = {
  readonly price_drop_record: ImprBoosterItem;
  readonly show_gmv_gain: boolean;
};

export type DropPriceForImpressionParams = {
  // JSON string with dropped percentages
  readonly drop_percentages: string;
};

export type CancelDropPriceParams = {
  // comma-seperated record ids
  readonly record_ids: string;
};

export type CancelDropPriceResponse = {};

export type UpdateAutoRenewParams = {
  readonly record_id: string;
  readonly auto_renew: boolean;
};

export type UpdateAutoRenewResponse = {};

export type CompletePriceDropTodosParams = {
  readonly selected_tab: SelectedTab;
};

export type CreatePriceDropRecordParams = {
  readonly product_id: string;
  readonly drop_percentage: number;
  readonly auto_renew: boolean;
  readonly start_date: string;
};

export type CreatePriceDropRecordResponse = {};

export type GetPriceDropEligibleProductsParams = {
  readonly count: number;
  readonly start: number;
  readonly search_type: EligibleProductsSearchType;
  readonly search_query: string;
  readonly wish_express_only: boolean;
  readonly start_id: string;
};

export type EligibleProduct = {
  readonly id: string;
  readonly name: string;
  readonly parent_sku: string;
  readonly wishes: number;
  readonly sales: number;
  readonly min_price: number;
  readonly max_price: number;
  readonly currency_code: CurrencyCode;
  readonly rating_count: number;
  readonly average_rating: number;
  readonly eligible_for_campaign: boolean;
};

export type GetPriceDropEligibleProductsResponse = {
  readonly feed_ended: boolean;
  readonly num_results: number;
  readonly rows: ReadonlyArray<EligibleProduct>;
  readonly is_exempted: boolean;
};

export type GetPriceDropListPageParamsResponse = {
  readonly currency_code: CurrencyCode;
  readonly show_trial_success_modal: boolean;
  readonly show_gmv_gain: boolean;
  readonly price_drop_v2: boolean;
  readonly price_drop_deprecate_v1: boolean;
};

export type ReissuePriceDropCampaignParams = {
  readonly campaign_id: string;
  readonly drop_percentage: number;
};

export type ReissuePriceDropCampaignResponse = {};

export type CancelPriceDropRecordParams = {
  readonly price_drop_record_id: string;
};

export type UploadPriceDropCampaignCsvParams = {
  readonly file_url: string;
};
export type UpdatePriceDropCampaignCsvParams = {
  readonly file_url: string;
};

export type UploadPriceDropCampaignCsvResponse = {
  readonly created_count: number;
  readonly errors: ReadonlyArray<string>;
};
export type UpdatePriceDropCampaignCsvResponse = {
  readonly errors: ReadonlyArray<string>;
  readonly created_count: number;
};
export type DownloadPriceDropCampaignCsvResponse = {
  readonly errors: ReadonlyArray<string>;
};

export const getPriceDropRecords = (
  args: GetPriceDropRecordsParams
): MerchantAPIRequest<GetPriceDropRecordsParams, GetPriceDropRecordsResponse> =>
  new MerchantAPIRequest("marketplace/price-drop-records", args);

export const cancelDropPrice = (
  args: CancelDropPriceParams
): MerchantAPIRequest<CancelDropPriceParams, CancelDropPriceResponse> =>
  new MerchantAPIRequest("marketplace/cancel-drop-price", args);

export const dropPriceForImpression = (
  args: DropPriceForImpressionParams
): MerchantAPIRequest<DropPriceForImpressionParams, DropPriceResponse> =>
  new MerchantAPIRequest("marketplace/drop-price-for-impression", args);

export const getDropPriceProductPerformance = (
  args: GetDropPriceProductPerformanceParams
): MerchantAPIRequest<
  GetDropPriceProductPerformanceParams,
  GetDropPriceProductPerformanceResponse
> =>
  new MerchantAPIRequest(
    "marketplace/get-price-drop-product-performance",
    args
  );

export const getDropPriceBasicInfo = (
  args: GetDropPriceBasicInfoParams
): MerchantAPIRequest<
  GetDropPriceBasicInfoParams,
  GetDropPriceBasicInfoResponse
> => new MerchantAPIRequest("marketplace/get-price-drop-basic-info", args);

export const updateAutoRenew = (
  args: UpdateAutoRenewParams
): MerchantAPIRequest<UpdateAutoRenewParams, UpdateAutoRenewResponse> =>
  new MerchantAPIRequest("marketplace/update-price-drop-auto-renew", args);

export const completePriceDropTodos = (
  args: CompletePriceDropTodosParams
): MerchantAPIRequest<CompletePriceDropTodosParams, {}> =>
  new MerchantAPIRequest("marketplace/complete-price-drop-todos", args);

export const createPriceDropRecord = (
  args: CreatePriceDropRecordParams
): MerchantAPIRequest<
  CreatePriceDropRecordParams,
  CreatePriceDropRecordResponse
> => new MerchantAPIRequest("marketplace/create-price-drop-record", args);

export const getPriceDropEligibleProducts = (
  args: GetPriceDropEligibleProductsParams
): MerchantAPIRequest<
  GetPriceDropEligibleProductsParams,
  GetPriceDropEligibleProductsResponse
> =>
  new MerchantAPIRequest("marketplace/get-price-drop-eligible-products", args);

export const getPriceDropListPageParams = (): MerchantAPIRequest<
  {},
  GetPriceDropListPageParamsResponse
> => new MerchantAPIRequest("marketplace/get-price-drop-list-page-params", {});

export const reissuePriceDropCampaign = (
  args: ReissuePriceDropCampaignParams
): MerchantAPIRequest<
  ReissuePriceDropCampaignParams,
  ReissuePriceDropCampaignResponse
> => new MerchantAPIRequest("marketplace/reissue-price-drop-campaign", args);

export const cancelPriceDropRecord = (
  args: CancelPriceDropRecordParams
): MerchantAPIRequest<CancelPriceDropRecordParams, {}> =>
  new MerchantAPIRequest("marketplace/cancel-price-drop-record", args);

export const uploadPriceDropCampaignCsv = (
  args: UploadPriceDropCampaignCsvParams
): MerchantAPIRequest<
  UploadPriceDropCampaignCsvParams,
  UploadPriceDropCampaignCsvResponse
> => new MerchantAPIRequest("marketplace/upload-price-drop-campaign-csv", args);

export const updatePriceDropCampaignCsv = (
  args: UploadPriceDropCampaignCsvParams
): MerchantAPIRequest<
  UpdatePriceDropCampaignCsvParams,
  UpdatePriceDropCampaignCsvResponse
> => new MerchantAPIRequest("marketplace/update-price-drop-campaign-csv", args);

export const downloadPriceDropCampaignCsv = (): MerchantAPIRequest<
  {},
  DownloadPriceDropCampaignCsvResponse
> => new MerchantAPIRequest("marketplace/price-drop/export", {});
