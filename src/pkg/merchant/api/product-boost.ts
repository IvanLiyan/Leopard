/* Lego Components */
import { SortOrder } from "@ContextLogic/lego";

/* Lego Toolkit */
import { CurrencyCode } from "@toolkit/currency";

/* Merchant Model */
import { MaxSpendingBreakdown } from "@merchant/model/product-boost/Campaign";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

/* Type Import */
import {
  CurrencyValue,
  Datetime,
  MarketingCampaignState,
  MarketingFlexibleBudgetType,
  Maybe,
  CreditTransactionRecord,
  BalanceTransactionRecord,
  MarketingBonusBudgetType,
} from "@schema/types";

export type CampaignState =
  | "NEW"
  | "SAVED"
  | "STARTED"
  | "ENDED"
  | "CANCELLED"
  | "PENDING";

export type Product = {
  readonly product_id: string;
  readonly keywords: string;
  readonly bid: number | string;
  readonly is_maxboost: boolean;
  readonly brand_id?: string | null | undefined;
};

export type CampaignProductDailyStats = {
  readonly campaign_id: string;
  readonly campaign_name: string;
  readonly product_id: string;
  readonly date: string;
  readonly impressions: number;
  readonly sales: number;
  readonly gmv: number;
};

export type ProductPerformanceStats = {
  readonly product_id: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly daily_stats: ReadonlyArray<CampaignProductDailyStats>;
  readonly total_impressions: number;
  readonly total_orders: number;
  readonly total_gmv: number;
};

export type Campaign = {
  readonly campaign_name: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly is_evergreen: boolean;
  readonly products: ReadonlyArray<Product>;
  readonly max_budget: number;
  readonly merchant_budget: number;
  readonly is_v2: boolean;
  readonly state: MarketingCampaignState;
  readonly merchant_id: string;
  readonly scheduled_add_budget_enabled: boolean;
  readonly scheduled_add_budget_amount: number | string;
  readonly scheduled_add_budget_days: ReadonlyArray<number>;
  readonly source: number;
  readonly campaign_id: string;
  readonly has_maxboost_product: boolean;
  readonly capped_spend: number;
  readonly gmv: number;
  readonly automated_type: number;
  readonly created_from_evergreen: boolean;
  readonly spend_over_gmv: number | null | undefined;
  readonly is_automated: boolean;
  readonly current_unpaid: number;
  readonly has_been_paid: boolean;
  readonly capped_paid_impressions?: number;
  readonly training_progress: number;
  readonly discount_factor?: number;
  readonly localized_currency?: CurrencyCode;
  readonly min_budget_to_add: number;
  readonly max_budget_to_add: number;
  readonly is_budget_depleted?: boolean;
  readonly is_budget_nearly_depleted?: boolean;
  readonly automated_state?: number;
  readonly flexible_budget_enabled?: boolean;
  readonly min_spend?: number;
  readonly flexible_budget_type?: MarketingFlexibleBudgetType;
  readonly intense_boost?: boolean;
  readonly is_bonus_budget_campaign: boolean;
  readonly bonus_budget_rate: number;
  readonly localized_bonus_budget: number;
  readonly localized_used_bonus_budget: number;
  readonly bonus_budget_type: MarketingBonusBudgetType;
};

export type SaveCampaignParams = {
  readonly campaign_id: string;
  readonly campaign_name: string | null | undefined;
  readonly max_budget: number | null | undefined;
  readonly end_date: string | null | undefined;
  readonly start_date: string | null | undefined;
  readonly is_evergreen: boolean | null | undefined;
  readonly products: string | null | undefined;
  readonly is_v2: boolean | null | undefined;
  readonly scheduled_add_budget_enabled: boolean | null | undefined;
  readonly scheduled_add_budget_days: ReadonlyArray<number> | null | undefined;
  readonly scheduled_add_budget_amount: number | null | undefined;
  readonly num_products?: number;
  readonly source: number;
  readonly flexible_budget_enabled?: boolean;
  readonly intense_boost?: boolean;
};

export type SaveRunningCampaignParams = {
  readonly campaign_id: string;
  readonly max_budget?: number | null | undefined;
  readonly end_date?: string | null | undefined;
  readonly is_evergreen?: boolean | null | undefined;
  readonly products?: string | null | undefined;
  readonly scheduled_add_budget_enabled?: boolean | null | undefined;
  readonly scheduled_add_budget_days?: ReadonlyArray<number> | null | undefined;
  readonly scheduled_add_budget_amount?: number | null | undefined;
  readonly source: number;
  readonly campaign_name?: string | null | undefined;
  readonly is_v2?: boolean | null | undefined;
  readonly num_products?: number;
  readonly start_date?: string | null | undefined;
  readonly flexible_budget_enabled?: boolean;
  readonly intense_boost?: boolean;
};

export type ProductsSearchType = "id" | "name" | "sku";

export type EligibleProductsSearchType =
  | "id"
  | "name"
  | "sku"
  | "parent_sku"
  | "tags";

export type EligibleProduct = {
  readonly id: string;
  readonly name: string;
  readonly parent_sku: string;
  readonly wishes: number;
  readonly sales: number;
  readonly brand_id?: string | null | undefined;
  readonly trending?: boolean;
  readonly eligible_for_campaign?: boolean;
  readonly has_video?: boolean;
};

export type ProductPerformance = {
  readonly product_name: string;
  readonly product_id: string;
  readonly product_sku: string;
  readonly lifetime_sales: number;
  readonly lifetime_gmv: number;
  readonly lifetime_spend: number;
  readonly num_campaigns: number;
  readonly num_active_days: number;
};

export type ProductDateStat = {
  product_id: string;
  product_name: string;
  impressions: number;
  sales: number;
  gmv: number;
  spend: number;
  paid_impressions: number | null | undefined;
  external_impressions: number | null | undefined;
  external_spend: number | null | undefined;
};

export type CampaignDateStat = {
  total_budget: number;
};
export type CampaignDetailByDateStats = {
  [date: string]: CampaignDateStat;
};

export type CampaignDetailStats = {
  [date: string]: {
    [product_id: string]: ProductDateStat;
  };
};

export type InvoiceType =
  | "charge"
  | "discount"
  | "pb_credit"
  | "pb_balance"
  | "account_balance"
  | "enrollment"
  | "payment";

export type CampaignInvoice = {
  type: InvoiceType;
  id: string | null | undefined;
  charge: number | null | undefined;
  adjustment: number | null | undefined;
  date_str: string | null | undefined;
  start_date: string | null | undefined;
  end_date: string | null | undefined;
};

export type CampaignProductStatsEntry = {
  readonly product_id: string;
  readonly product_name: string;
  readonly impressions: number | null | undefined;
  readonly sales: number;
  readonly gmv: number;
  readonly spend: number;
  readonly external_impressions: number | null | undefined;
  readonly external_spend: number | null | undefined;
  readonly feedback_type: number | null | undefined;
  readonly enrollment_fee: number;
  readonly is_maxboost: boolean;
  readonly is_brandboost: boolean;
  readonly cpm: number | null | undefined;
  readonly training_progress?: number;
};

export type PBCreditTransactionRecord = Pick<
  CreditTransactionRecord,
  | "id"
  | "updatedReason"
  | "campaignId"
  | "productId"
  | "updateReasonDescription"
  | "receiptId"
> & {
  readonly dateCreated: Pick<Datetime, "formatted">;
  readonly transactionAmount?: Maybe<Pick<CurrencyValue, "display">>;
  readonly expiredDate?: Maybe<Pick<Datetime, "formatted">>;
};

export type PBBalanceTransactionRecord = Pick<
  BalanceTransactionRecord,
  | "id"
  | "updatedReason"
  | "campaignId"
  | "productId"
  | "updateReasonDescription"
  | "receiptId"
> & {
  readonly dateCreated: Pick<Datetime, "formatted">;
  readonly transactionAmount: Pick<CurrencyValue, "display">;
};

export type GetMerchantSpendingStatsParams = {
  readonly currency?: CurrencyCode;
  readonly campaign_id?: string;
};

export type GetProductBoostEligibleProductsParams = {
  readonly count: number;
  readonly start: number;
  readonly search_type: EligibleProductsSearchType;
  readonly search_query: string;
  readonly wish_express_only: boolean;
};

export type GetProductBoostCampaignsParams = {
  readonly count: number;
  readonly start: number | null | undefined;
  readonly sort: string | null | undefined;
  readonly order: SortOrder | null | undefined;
  readonly filter_search_string: string | null | undefined;
  readonly filter_states:
    | ReadonlyArray<MarketingCampaignState>
    | null
    | undefined;
  readonly filter_evergreen: ReadonlyArray<boolean> | null | undefined;
  readonly filter_automated: ReadonlyArray<boolean> | null | undefined;
  readonly filter_from_start_date: string | null | undefined;
  readonly filter_to_start_date: string | null | undefined;
  readonly filter_from_end_date: string | null | undefined;
  readonly filter_to_end_date: string | null | undefined;
};

export type GetProductBoostProductsParams = {
  readonly offset: number;
  readonly limit: number;
  readonly search_type: ProductsSearchType;
  readonly search_query: string;
};

export type CampaignActionParams = {
  readonly campaign_id: string;
};

export type DuplicateAutomatedCampaignParams = {
  readonly campaign_id: string;
  readonly is_maxboost: boolean;
  readonly start_date?: string;
  readonly max_budget?: number;
  readonly dup_source: number | null | undefined;
};

export type EnableCampaignParams = {
  readonly campaign_id: string;
  readonly is_maxboost?: boolean;
  readonly start_date?: string;
  readonly end_date?: string;
  readonly max_budget?: number;
  readonly caller_source: string;
};

export type ChangeEvergreenStatusParams = {
  readonly campaign_id: string;
  readonly set_evergreen: boolean;
};

export type GetProductBoostCampaignDetailPerformanceParams = {
  readonly campaign_id: string;
};

export type GetProductBoostProductLifetimePerformanceParams = {
  readonly product_id: string;
  readonly start_date: string;
  readonly end_date: string;
};

export type GetProductBoostCampaignDetailInvoiceParams = {
  readonly campaign_id: string;
};

export type GetProductBoostCampaignProductStatsParams = {
  readonly campaign_id: string;
};

export type BulkEnableAutomatedCampaignParams = {
  readonly campaign_ids: ReadonlyArray<string>;
  readonly caller_source: string;
};

export type BulkDuplicateAutomatedCampaignParams = {
  readonly campaign_ids: ReadonlyArray<string>;
};

export type BulkIncreaseCampaignBudgetParams = {
  readonly add_budget_data: string;
  readonly max_spending_displayed: number;
};

export type GetMerchantSpendingStatsResponse = {
  readonly max_allowed_spending: number;
  readonly max_spending_breakdown: MaxSpendingBreakdown;
  readonly is_payable: boolean;
};

export type GetProductBoostEligibleProductsResponse = {
  readonly feed_ended: boolean;
  readonly num_results: number;
  readonly rows: ReadonlyArray<EligibleProduct>;
};

export type GetProductBoostCampaignsResponse = {
  results: {
    readonly feed_ended: boolean;
    readonly next_offset: number;
    readonly num_results: number;
    readonly rows: ReadonlyArray<Campaign>;
  };
};

export type GetProductBoostProductsResponse = {
  results: {
    readonly feed_ended: boolean;
    readonly next_offset: number;
    readonly num_results: number;
    readonly rows: ReadonlyArray<ProductPerformance>;
  };
};

export type GetCampaignBudgetBreakdownResponse = {
  readonly max_allowed_spending: number;
  readonly max_spending_breakdown: MaxSpendingBreakdown;
  readonly merchant_budget: number;
  readonly is_payable: boolean;
  readonly show_suggested_budget: boolean;
  readonly suggested_budget: number;
  readonly discount_factor: number;
  readonly flexible_budget_enabled: boolean;
};

export type DuplicateAutomatedCampaignResponse = {
  readonly new_campaign_id: string;
};

export type GetUnpaidCampaignsResponse = {
  readonly campaigns: ReadonlyArray<Campaign>;
};

export type GetWalletBalanceResponse = {
  readonly balance_amount: number;
  readonly localized_balance_amount: number;
  readonly localized_balance_currency: CurrencyCode;
  readonly credit_amount: number;
  readonly localized_credit_amount: number;
  readonly localized_credit_currency: CurrencyCode;
};

export type ProductBoostCampaignAdminStat = {
  readonly date: string;
  readonly dateKey: string;
  readonly total_server_side_impressions: number | null;
  readonly total_client_side_impressions: number | null;
  readonly total_click_impressions: number | null;
  readonly total_impressions: number | null;
  readonly average_server_side_bid: number | null;
  readonly average_client_side_bid: number | null;
  readonly average_client_click_bid: number | null;
  readonly pb_attributed_gmv: number | null;
  readonly pb_roas: number | null;
};

export type ProductBoostCampaignAdminDetail = {
  [date: string]: ProductBoostCampaignAdminStat;
};

export type GetProductBoostCampaignDetailPerformanceResult = {
  campaign_product_stats: CampaignDetailStats;
  campaign_detail_stats: CampaignDetailByDateStats;
};

export type GetProductBoostProductLifetimePerformanceResult = {
  results: ProductPerformanceStats;
};

export type GetProductBoostCampaignDetailInvoiceResult = {
  readonly campaign_invoice_data: ReadonlyArray<CampaignInvoice>;
};

export type GetProductBoostCampaignProductStatsResult = {
  readonly aggregate_data: ReadonlyArray<CampaignProductStatsEntry>;
};

export type SaveCampaignResponse = {
  readonly dup_prods: ReadonlyArray<string>;
};

export type GetProductBoostCampaignBudgetInfoParams = {
  readonly products?: string;
  readonly start_date: string;
  readonly end_date: string;
  readonly campaign_id: string;
  readonly intense_boost?: boolean;
  readonly maxboost_product_count?: number;
};

export type GetProductBoostCampaignBudgetInfoResult = {
  readonly suggested_budget: number;
  readonly min_budget: number;
  readonly min_spend?: number;
};

export type GetProductBoostCampaignDetailParams = {
  readonly campaign_id: string;
};

export type GetProductBoostCampaignDetailResult = {
  readonly campaign_dict: Campaign;
  readonly max_allowed_spending: number;
};

export type GetProductBoostCampaignAdminStatsParams = {
  readonly campaign_id: string;
};

export type GetProductBoostCampaignAdminStatsResult = {
  readonly campaign_detail_admin_stats: ProductBoostCampaignAdminDetail;
};

export type GetProductBoostCampaignCountParams = {};

export type GetProductBoostCampaignCountResult = {
  readonly campaign_count: number;
};

export type ListProductBoostDepletedCampaignsParams = {};

export type ListProductBoostDepletedCampaignsResult = {
  readonly campaigns: ReadonlyArray<Campaign>;
};

export type GetProductBoostKeywordLastUpdateParams = {};

export type GetProductBoostKeywordLastUpdateResult = {
  readonly last_update: string;
};

export type GetProductBoostEditCampaignDictParams = {
  readonly campaign_id: string;
  readonly dup_campaign_id?: string;
};

export type GetProductBoostEditCampaignDictResult = {
  readonly campaign_dict: Campaign;
  readonly product_ids: string | null | undefined;
};

export type GetProductBoostDuplicateAutomatedCampaignInfoParams = {
  readonly campaign_id: string;
};

export type GetProductBoostDuplicateAutomatedCampaignInfoResult = {
  readonly campaign_name: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly max_budget: number;
  readonly localized_currency?: CurrencyCode;
  readonly product_count: number;
};

export type GetProductBoostEnableAutomatedCampaignInfoParams = {
  readonly campaign_id: string;
};

export type GetProductBoostEnableAutomatedCampaignInfoResult = {
  readonly campaign_name: string;
  readonly start_time: string;
  readonly end_time: string;
  readonly max_budget: number;
  readonly discount_factor: number;
  readonly localized_currency?: CurrencyCode;
};

export type GetHomePageModalParams = {
  readonly params_type: string;
};

export type PromoModalFields = {
  readonly title: string | null | undefined;
  readonly body: string | null | undefined;
  readonly button_text: string | null | undefined;
  readonly button_link: string | null | undefined;
  readonly promotion_id: string | null | undefined;
  readonly image: string | null | undefined;
  readonly background_color: string | null | undefined;
  readonly text_color: string | null | undefined;
};

export type FreePBCreditModalFields = {
  readonly expired_date: string;
  readonly initial_amount: string;
  readonly current_amount: string;
};

export type BulkResumeCampaign = {
  readonly campaign_name: string;
  readonly campaign_id: string;
  readonly start_date: string;
  readonly end_date: string;
  readonly max_budget: number;
  readonly max_budget_after_discount: number;
  readonly is_evergreen: boolean;
  readonly discount_str: string;
};

export type BulkIncreaseBudgetCampaign = {
  readonly campaign_id: string;
  readonly campaign_name: string;
  readonly spend: number;
  readonly budget: number;
  readonly gmv: number;
  readonly end_date: string;
  readonly suggested_budget: number;
  readonly min_budget_to_add: number;
};

export type BulkDuplicateCampaign = {
  readonly campaign_name: string;
  readonly campaign_id: string;
  readonly budget: number;
  readonly gmv: number;
  readonly spend: number;
};

export type GetHomePageModalResult = {
  readonly max_allowed_spending: number;
  readonly campaigns_near_budget_depletion: ReadonlyArray<
    BulkIncreaseBudgetCampaign
  >;
  readonly campaigns_to_duplicate: ReadonlyArray<BulkDuplicateCampaign>;
  readonly free_promo_products: ReadonlyArray<string>;
  readonly promo_message: PromoModalFields | null | undefined;
  readonly campaigns_to_enable: ReadonlyArray<BulkResumeCampaign>;
  readonly currency: CurrencyCode;
  readonly free_pb_credit_modal_info:
    | FreePBCreditModalFields
    | null
    | undefined;
  readonly fbw_campaigns_to_enable: ReadonlyArray<BulkResumeCampaign>;
  readonly can_view_refund_assurance_credit_modal: boolean;
};

export type RefundAssuranceBannerInfo = {
  readonly display: boolean;
  readonly refund_rate: number;
};

export type GetBannerInfoResult = {
  readonly fbw_promotion_display: boolean;
  readonly refund_assurance: RefundAssuranceBannerInfo;
};

export type VerifyProductBoostProductIdParams = {
  readonly product_id: string;
  readonly campaign_id?: string;
  readonly start_date?: string;
  readonly end_date?: string;
};

export type VerifyProductBoostProductIdResult = {
  readonly is_valid: boolean;
  readonly keywords?: string;
  readonly campaign_id?: string;
  readonly msg?: string;
};

export type BannerContent = {
  readonly title: string;
  readonly text: string;
  readonly banner_img_left?: string;
  readonly banner_img_right?: string;
  readonly button_url: string;
  readonly button_text: string;
};

export enum BannerLocation {
  homePage = "HOME_PAGE",
  createCampaignPage = "CREATE_CAMPAIGN_PAGE",
  listCampaignPage = "LIST_CAMPAIGN_PAGE",
}

export enum BannerType {
  fbwDiscount = "FBW_DISCOUNT",
  refundAssurance = "REFUND_ASSURANCE",
}

export type RecordClickBannerParams = {
  readonly banner_type: BannerType;
  readonly from_page: BannerLocation;
};

export const getMerchantSpendingStats = (
  args: GetMerchantSpendingStatsParams
): MerchantAPIRequest<
  GetMerchantSpendingStatsParams,
  GetMerchantSpendingStatsResponse
> => new MerchantAPIRequest("product-boost/get-merchant-spending-stats", args);

export const getProductBoostEligibleProducts = (
  args: GetProductBoostEligibleProductsParams
): MerchantAPIRequest<
  GetProductBoostEligibleProductsParams,
  GetProductBoostEligibleProductsResponse
> => new MerchantAPIRequest("product-boost/get-products", args);

export const getProductBoostCampaigns = (
  args: GetProductBoostCampaignsParams
): MerchantAPIRequest<
  GetProductBoostCampaignsParams,
  GetProductBoostCampaignsResponse
> => new MerchantAPIRequest("product-boost-history/get", args);

export const getProductBoostProducts = (
  args: GetProductBoostProductsParams
): MerchantAPIRequest<
  GetProductBoostProductsParams,
  GetProductBoostProductsResponse
> => new MerchantAPIRequest("product-boost/products/get", args);

export const cancelCampaign = (
  args: CampaignActionParams
): MerchantAPIRequest<CampaignActionParams, {}> =>
  new MerchantAPIRequest("product-boost/cancel", args);

export const stopCampaign = (
  args: CampaignActionParams
): MerchantAPIRequest<CampaignActionParams, {}> =>
  new MerchantAPIRequest("product-boost/stop", args);

export const getCampaignBudgetBreakdown = (
  args: CampaignActionParams
): MerchantAPIRequest<
  CampaignActionParams,
  GetCampaignBudgetBreakdownResponse
> =>
  new MerchantAPIRequest("product-boost/get-campaign-budget-breakdown", args);

export const duplicateAutomatedCampaign = (
  args: DuplicateAutomatedCampaignParams
): MerchantAPIRequest<
  DuplicateAutomatedCampaignParams,
  DuplicateAutomatedCampaignResponse
> => new MerchantAPIRequest("product-boost/duplicate", args);

export const enableCampaign = (
  args: EnableCampaignParams
): MerchantAPIRequest<EnableCampaignParams, {}> =>
  new MerchantAPIRequest("product-boost/enable", args);

export const changeEvergreenStatus = (
  args: ChangeEvergreenStatusParams
): MerchantAPIRequest<ChangeEvergreenStatusParams, {}> =>
  new MerchantAPIRequest(
    "product-boost/campaign-change-evergreen-status",
    args
  );

export const getUnpaidCampaigns = (): MerchantAPIRequest<
  {},
  GetUnpaidCampaignsResponse
> => new MerchantAPIRequest("product-boost/get-unpaid-campaigns", {});

export const getWalletBalance = (): MerchantAPIRequest<
  {},
  GetWalletBalanceResponse
> => new MerchantAPIRequest("product-boost/get-wallet-balance", {});

export const saveCampaign = (
  args: SaveCampaignParams
): MerchantAPIRequest<SaveCampaignParams, SaveCampaignResponse> =>
  new MerchantAPIRequest("product-boost/save", args);

export const saveRunningCampaign = (
  args: SaveRunningCampaignParams
): MerchantAPIRequest<SaveRunningCampaignParams, {}> =>
  new MerchantAPIRequest("product-boost/save-running-campaign", args);

export const getProductBoostCampaignDetailPerformance = (
  args: GetProductBoostCampaignDetailPerformanceParams
): MerchantAPIRequest<
  GetProductBoostCampaignDetailPerformanceParams,
  GetProductBoostCampaignDetailPerformanceResult
> =>
  new MerchantAPIRequest("product-boost/get-campaign-detail-performance", args);

export const getProductBoostProductLifetimePerformance = (
  args: GetProductBoostProductLifetimePerformanceParams
): MerchantAPIRequest<
  GetProductBoostProductLifetimePerformanceParams,
  GetProductBoostProductLifetimePerformanceResult
> =>
  new MerchantAPIRequest(
    "product-boost/products/get-product-lifetime-performance",
    args
  );

export const getProductBoostCampaignDetailInvoice = (
  args: GetProductBoostCampaignDetailInvoiceParams
): MerchantAPIRequest<
  GetProductBoostCampaignDetailInvoiceParams,
  GetProductBoostCampaignDetailInvoiceResult
> => new MerchantAPIRequest("product-boost/get-campaign-detail-invoice", args);

export const getProductBoostCampaignProductStats = (
  args: GetProductBoostCampaignProductStatsParams
): MerchantAPIRequest<
  GetProductBoostCampaignProductStatsParams,
  GetProductBoostCampaignProductStatsResult
> => new MerchantAPIRequest("product-boost/get-campaign-product-stats", args);

export const getProductBoostCampaignBudgetInfo = (
  args: GetProductBoostCampaignBudgetInfoParams
): MerchantAPIRequest<
  GetProductBoostCampaignBudgetInfoParams,
  GetProductBoostCampaignBudgetInfoResult
> => new MerchantAPIRequest("product-boost/get-campaign-budget-info", args);

export const getProductBoostCampaignAdminStats = (
  args: GetProductBoostCampaignAdminStatsParams
): MerchantAPIRequest<
  GetProductBoostCampaignAdminStatsParams,
  GetProductBoostCampaignAdminStatsResult
> =>
  new MerchantAPIRequest("product-boost/get-campaign-admin-performance", args);

export const getProductBoostCampaignDetail = (
  args: GetProductBoostCampaignDetailParams
): MerchantAPIRequest<
  GetProductBoostCampaignDetailParams,
  GetProductBoostCampaignDetailResult
> =>
  new MerchantAPIRequest<
    GetProductBoostCampaignDetailParams,
    GetProductBoostCampaignDetailResult
  >("product-boost/get-campaign-detail", args).setOptions({
    failSilently: true,
  });

export const getProductBoostCampaignCount = (
  args: GetProductBoostCampaignCountParams
): MerchantAPIRequest<
  GetProductBoostCampaignCountParams,
  GetProductBoostCampaignCountResult
> => new MerchantAPIRequest("product-boost/get-campaign-count", args);

export const listProductBoostDepletedCampaigns = (
  args: ListProductBoostDepletedCampaignsParams
): MerchantAPIRequest<
  ListProductBoostDepletedCampaignsParams,
  ListProductBoostDepletedCampaignsResult
> => new MerchantAPIRequest("product-boost/list-depleted-campaigns", args);

export const getProductBoostKeywordLastUpdate = (
  args: GetProductBoostKeywordLastUpdateParams
): MerchantAPIRequest<
  GetProductBoostKeywordLastUpdateParams,
  GetProductBoostKeywordLastUpdateResult
> => new MerchantAPIRequest("product-boost/get-keyword-last-update", args);

export const getProductBoostEditCampaignDict = (
  args: GetProductBoostEditCampaignDictParams
): MerchantAPIRequest<
  GetProductBoostEditCampaignDictParams,
  GetProductBoostEditCampaignDictResult
> => new MerchantAPIRequest("product-boost/get-edit-campaign-dict", args);

export const getProductBoostDuplicateAutomatedCampaignInfo = (
  args: GetProductBoostDuplicateAutomatedCampaignInfoParams
): MerchantAPIRequest<
  GetProductBoostDuplicateAutomatedCampaignInfoParams,
  GetProductBoostDuplicateAutomatedCampaignInfoResult
> =>
  new MerchantAPIRequest(
    "product-boost/get-duplicate-automated-campaign-info",
    args
  );

export const getProductBoostEnableAutomatedCampaignInfo = (
  args: GetProductBoostEnableAutomatedCampaignInfoParams
): MerchantAPIRequest<
  GetProductBoostEnableAutomatedCampaignInfoParams,
  GetProductBoostEnableAutomatedCampaignInfoResult
> =>
  new MerchantAPIRequest(
    "product-boost/get-enable-automated-campaign-info",
    args
  );

export const bulkEnableAutomatedCampaign = (
  args: BulkEnableAutomatedCampaignParams
): MerchantAPIRequest<BulkEnableAutomatedCampaignParams, {}> =>
  new MerchantAPIRequest("product-boost/enable-campaign-bulk", args);

export const bulkDuplicateAutomatedCampaign = (
  args: BulkDuplicateAutomatedCampaignParams
): MerchantAPIRequest<BulkDuplicateAutomatedCampaignParams, {}> =>
  new MerchantAPIRequest("product-boost/duplicate-campaign-bulk", args);

export const bulkIncreaseCampaignBudget = (
  args: BulkIncreaseCampaignBudgetParams
): MerchantAPIRequest<BulkIncreaseCampaignBudgetParams, {}> =>
  new MerchantAPIRequest("product-boost/bulk-add-campaign-budget", args);

export const getHomePageModal = (
  args: GetHomePageModalParams
): MerchantAPIRequest<GetHomePageModalParams, GetHomePageModalResult> =>
  new MerchantAPIRequest("product-boost/get-home-page-params", args);

export const verifyProductBoostProductId = (
  args: VerifyProductBoostProductIdParams
): MerchantAPIRequest<
  VerifyProductBoostProductIdParams,
  VerifyProductBoostProductIdResult
> => new MerchantAPIRequest("product-boost/verify-product-id", args);

export const getBannerInfo = (): MerchantAPIRequest<{}, GetBannerInfoResult> =>
  new MerchantAPIRequest("product-boost/get-banner-info", {});

export const recordClickBanner = (
  args: RecordClickBannerParams
): MerchantAPIRequest<RecordClickBannerParams, {}> =>
  new MerchantAPIRequest("product-boost/click-banner", args);
