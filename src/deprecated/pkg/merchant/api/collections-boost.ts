/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type CollectionsBoostCampaignState =
  | "NEW"
  | "VALIDATING"
  | "STARTED"
  | "ENDED"
  | "CANCELED";

export type CollectionsBoostCollectionState =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type CollectionsBoostSource = "UNKNOWN" | "MANUAL" | "AUTOMATED";

export type CollectionRejectReason =
  | "INAPPROPRIATE_NAME"
  | "INAPPROPRIATE_LOGO"
  | "INAPPROPRIATE_PRODUCTS"
  | "INAPPROPRIATE_SEARCH_TERMS";

export type CollectionsBoostSearchQueryState =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";

export type EligibleProductsSearchType =
  | "id"
  | "name"
  | "sku"
  | "parent_sku"
  | "tags";

export type CollectionSearchType =
  | "collection_id"
  | "product_id"
  | "collection_name";

export type CampaignSearchType =
  | "campaign_id"
  | "product_id"
  | "collection_name";

export type CampaignCancelReason = "INSUFFICIENT_PRODUCTS";

export type CollectionSearchSortOrder = "des" | "asc" | "none";

export type CollectionsBoostCampaignFeeType = "FEE" | "CREDIT";

export type CollectionsBoostCampaignFee = {
  readonly amount: number;
  readonly fee_id?: string;
  readonly fee_type?: CollectionsBoostCampaignFeeType;
};

export type CollectionsProduct = {
  readonly product_id: string;
  readonly keywords?: string;
};

export type CollectionsBoostSearchQuery = {
  readonly search_term: string;
  readonly bid: number;
  readonly rawBid?: string;
  readonly state?: CollectionsBoostSearchQueryState;
};

export type CollectionsBoostRelatedProducts = {
  readonly product_id: string;
};

export type CollectionsBoostApiCampaign = {
  readonly id: string;
  readonly name: string;
  readonly state: CollectionsBoostCampaignState;
  readonly search_queries: ReadonlyArray<CollectionsBoostSearchQuery>;
  readonly related_products: ReadonlyArray<CollectionsBoostRelatedProducts>;
  readonly products: ReadonlyArray<CollectionsProduct>;
  readonly start_date: string;
  readonly end_date: string;
  readonly logo_url: string;
  readonly impressions: number;
  readonly attributed_tile_impressions: number;
  readonly gmv: number;
  readonly keywords: string;
  readonly total_bid: number;
  readonly campaign_fee_paid_amount: number;
  readonly campaign_fees: ReadonlyArray<CollectionsBoostCampaignFee>;
  readonly is_auto_renew: boolean;
  readonly cancel_reason?: CampaignCancelReason;
  readonly is_rejected: boolean;
  readonly feed_collection_id?: string;
  readonly localized_currency: string;
  readonly conversion_rate: number;
  readonly localized_gmv: number;
  readonly source_collection_id: string;
};

export type CollectionsBoostApiCollection = {
  readonly id: string;
  readonly name: string;
  readonly merchant_id: string;
  readonly state: CollectionsBoostCollectionState;
  readonly search_queries: ReadonlyArray<CollectionsBoostSearchQuery>;
  readonly related_products: ReadonlyArray<CollectionsBoostRelatedProducts>;
  readonly products: ReadonlyArray<CollectionsProduct>;
  readonly logo_url: string;
  readonly reject_reason?: CollectionRejectReason;
  readonly reject_comment?: string;
  readonly stored_to_s3: boolean;
  readonly source: CollectionsBoostSource;
};

export type CollectionsBoostCampaignStats = {
  readonly date?: string;
  readonly gmv?: number;
  readonly localized_gmv?: number;
  readonly impressions?: number;
  readonly clicks?: number;
  readonly tile_clicks?: number;
  readonly attributed_impressions?: number;
  readonly attributed_tile_impressions?: number;
  readonly search_term_stats: ReadonlyArray<CollectionsBoostCampaignSearchTermStat>;
  readonly product_stats: ReadonlyArray<CollectionsBoostCampaignProductStat>;
};

export type CollectionsBoostCampaignSearchTermStat = {
  readonly search_term: string;
  readonly impressions: string;
  readonly clicks: string;
};

export type CollectionsBoostCampaignProductStat = {
  readonly product_id: string;
  readonly impressions: string;
  readonly clicks: string;
};

export type CollectionsBoostCreditInfo = {
  readonly issued_date: string;
  readonly expired_date: string;
  readonly amount: number;
};

export type GetCollectionsBoostCampaignsParams = {
  readonly count: number;
  readonly start: number;
  readonly filter_states?: ReadonlyArray<CollectionsBoostCampaignState>;
  readonly search_type?: CampaignSearchType;
  readonly search_value?: string;
  readonly filter_start_date: string | null;
  readonly filter_end_date: string | null;
};

export type GetCollectionsBoostCampaignsResponse = {
  readonly results: {
    readonly feed_ended: boolean;
    readonly next_offset: number;
    readonly num_results: number;
    readonly rows: ReadonlyArray<CollectionsBoostApiCampaign>;
  };
};

export type GetCollectionsBoostCollectionsParams = {
  readonly count: number;
  readonly start: number;
  readonly filter_states?: ReadonlyArray<CollectionsBoostCollectionState>;
  readonly search_type?: CollectionSearchType;
  readonly search_value?: string;
  readonly sort_field?: string;
  readonly sort_order?: CollectionSearchSortOrder;
};

export type GetCollectionsBoostCollectionsResponse = {
  readonly results: {
    readonly feed_ended: boolean;
    readonly next_offset: number;
    readonly num_results: number;
    readonly rows: ReadonlyArray<CollectionsBoostApiCollection>;
  };
};

export type GetCollectionsBoostCampaignParams = {
  readonly campaign_id: string;
};

export type GetCollectionsBoostCampaignResponse = {
  readonly campaign_dict: CollectionsBoostApiCampaign;
};

export type ChangeCollectionsBoostCampaignAutoRenewParams = {
  readonly campaign_id: string;
  readonly is_auto_renew: boolean;
};

export type GetCollectionsBoostCollectionParams = {
  readonly collection_id: string;
};

export type GetCollectionsBoostCollectionResponse = {
  readonly collection: CollectionsBoostApiCollection;
};

export type GetCollectionsBoostMerchantInfoParams = {};

export type GetCollectionsBoostMerchantInfoResponse = {
  readonly available_balance: number;
  readonly balance: number;
  readonly credit: number;
  readonly credit_info: ReadonlyArray<CollectionsBoostCreditInfo>;
  readonly current_conversion_rate: number;
  readonly current_conversion_table_id: string;
  readonly min_start_date: string;
  readonly max_start_date: string;
  readonly policy_rate_map: {
    [key: string]: number;
  };
  readonly preferred_currency: string;
  readonly duration: number;
};

export type EditCollectionsCampaignParams = {
  readonly campaign_id?: string;
  readonly collection_id?: string;
  readonly conversion_rate?: number;
  readonly conversion_table_id?: string;
  readonly localized_currency?: string;
  readonly search_queries?: string;
  readonly start_date?: string;
  readonly state_to?: CollectionsBoostCampaignState;
  readonly is_auto_renew?: boolean;
};

export type EditCollectionsCampaignResponse = {};

export type EditCollectionsBoostCollectionParams = {
  readonly collection_id?: string;
  readonly collection_name?: string;
  readonly products?: string;
  readonly search_queries?: string;
  readonly related_products?: string;
  readonly logo_url?: string;
};

export type EditCollectionsBoostCollectionResponse = {};

export type EligibleProduct = {
  readonly id: string;
  readonly name: string;
  readonly parent_sku: string;
  readonly eligible_for_campaign?: boolean;
};

export type GetCollectionsBoostEligibleProductsResponse = {
  readonly feed_ended: boolean;
  readonly num_results: number;
  readonly rows: ReadonlyArray<EligibleProduct>;
};

export type GetCollectionsBoostEligibleProductsParams = {
  readonly count: number;
  readonly start: number;
  readonly search_type: EligibleProductsSearchType;
  readonly search_query: string;
};

export type ReviewCollectionsBoostCollectionsParams = {
  readonly collection_ids: ReadonlyArray<string>;
  readonly approved: boolean;
  readonly reject_reason?: CollectionRejectReason;
  readonly reject_comment?: string;
  readonly is_adult?: boolean;
};

export type GetCollectionsBoostCampaignPerformanceParams = {
  readonly campaign_id: string;
};

export type GetCollectionsBoostCampaignPerformanceResponse = {
  readonly preferred_currency: string;
  readonly dod_stats: ReadonlyArray<CollectionsBoostCampaignStats>;
  readonly aggregated_stats: CollectionsBoostCampaignStats;
  readonly show_search_term_perf: boolean;
  readonly show_product_perf: boolean;
};

export type ReviewCollectionsBoostCollectionsResponse = {};

export type GetSearchTermThresholdBidParams = {
  readonly search_queries: string;
  readonly start_date: string;
};

export type GetSearchTermThresholdBidResponse = {
  readonly threshold_dict: {
    readonly [search_term: string]: number;
  };
};

export const getCollectionsBoostCampaigns = (
  args: GetCollectionsBoostCampaignsParams
): MerchantAPIRequest<
  GetCollectionsBoostCampaignsParams,
  GetCollectionsBoostCampaignsResponse
> => new MerchantAPIRequest("collections-boost/get-campaigns", args);

export const changeCollectionsBoostCampaignsAutoRenew = (
  args: ChangeCollectionsBoostCampaignAutoRenewParams
): MerchantAPIRequest<ChangeCollectionsBoostCampaignAutoRenewParams, {}> =>
  new MerchantAPIRequest("collections-boost/edit-auto-renew", args);

export const getCollectionsBoostCollections = (
  args: GetCollectionsBoostCollectionsParams
): MerchantAPIRequest<
  GetCollectionsBoostCollectionsParams,
  GetCollectionsBoostCollectionsResponse
> => new MerchantAPIRequest("collections-boost/get-collections", args);

export const getCollectionsBoostMerchantInfo = (
  args: GetCollectionsBoostMerchantInfoParams
): MerchantAPIRequest<
  GetCollectionsBoostMerchantInfoParams,
  GetCollectionsBoostMerchantInfoResponse
> => new MerchantAPIRequest("collections-boost/get-merchant-info", args);

export const getCollectionsBoostCampaignById = (
  args: GetCollectionsBoostCampaignParams
): MerchantAPIRequest<
  GetCollectionsBoostCampaignParams,
  GetCollectionsBoostCampaignResponse
> => new MerchantAPIRequest("collections-boost/get-campaign-by-id", args);

export const getCollectionsBoostCampaignPerformance = (
  args: GetCollectionsBoostCampaignPerformanceParams
): MerchantAPIRequest<
  GetCollectionsBoostCampaignPerformanceParams,
  GetCollectionsBoostCampaignPerformanceResponse
> => new MerchantAPIRequest("collections-boost/campaign-performance", args);

export const editCollectionsCampaign = (
  args: EditCollectionsCampaignParams
): MerchantAPIRequest<
  EditCollectionsCampaignParams,
  EditCollectionsCampaignResponse
> => new MerchantAPIRequest("collections-boost/save-campaign", args);

export const getCollectionsBoostEligibleProducts = (
  args: GetCollectionsBoostEligibleProductsParams
): MerchantAPIRequest<
  GetCollectionsBoostEligibleProductsParams,
  GetCollectionsBoostEligibleProductsResponse
> => new MerchantAPIRequest("collections-boost/get-products", args);

export const getCollectionsBoostCollection = (
  args: GetCollectionsBoostCollectionParams
): MerchantAPIRequest<
  GetCollectionsBoostCollectionParams,
  GetCollectionsBoostCollectionResponse
> => new MerchantAPIRequest("collections-boost/get-collection", args);

export const editCollectionsBoostCollection = (
  args: EditCollectionsBoostCollectionParams
): MerchantAPIRequest<
  EditCollectionsBoostCollectionParams,
  EditCollectionsBoostCollectionResponse
> => new MerchantAPIRequest("collections-boost/edit-collection", args);

export const reviewCollectionsBoostCollections = (
  args: ReviewCollectionsBoostCollectionsParams
): MerchantAPIRequest<
  ReviewCollectionsBoostCollectionsParams,
  ReviewCollectionsBoostCollectionsResponse
> => new MerchantAPIRequest("collections-boost/review-collections", args);

export const getSearchTermThresholdBid = (
  args: GetSearchTermThresholdBidParams
): MerchantAPIRequest<
  GetSearchTermThresholdBidParams,
  GetSearchTermThresholdBidResponse
> =>
  new MerchantAPIRequest(
    "collections-boost/get-search-term-threshold-bid",
    args
  );
