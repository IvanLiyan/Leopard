import { PaymentCurrencyCode } from "@schema";

// ==============================================
// product-boost/get-home-page-params
// ==============================================

export const PB_GET_HOME_PAGE_PARAMS_ENDPOINT =
  "/api/product-boost/get-home-page-params";

// if params_type == "modal"
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
  readonly campaigns_near_budget_depletion: ReadonlyArray<BulkIncreaseBudgetCampaign>;
  readonly campaigns_to_duplicate: ReadonlyArray<BulkDuplicateCampaign>;
  readonly free_promo_products: ReadonlyArray<string>;
  readonly promo_message: PromoModalFields | null | undefined;
  readonly campaigns_to_enable: ReadonlyArray<BulkResumeCampaign>;
  readonly currency: PaymentCurrencyCode;
  readonly free_pb_credit_modal_info:
    | FreePBCreditModalFields
    | null
    | undefined;
  readonly fbw_campaigns_to_enable: ReadonlyArray<BulkResumeCampaign>;
  readonly can_view_refund_assurance_credit_modal: boolean;
};

export type AutomatedCampaign = {
  readonly campaign_id: string;
  readonly budget: number;
  readonly discount: number;
  readonly currency_code: PaymentCurrencyCode;
  readonly product_id: string;
};

// if params_type == "banner"
export type PbBannerImage =
  | "DEFAULT"
  | "EASTER"
  | "MOTHER"
  | "SUMMER"
  | "JULY"
  | "PRE_HOLIDAY"
  | "HALLOWEEN"
  | "SINGLES_DAY"
  | "THANKSGIVING"
  | "INCREASE_BUDGET"
  | "BLACK_FRIDAY"
  | "CHINESE_NEW_YEAR"
  | "COVID"
  | "MAY_HIGH_DEMAND";

export type PromoBannerMessage = {
  readonly key: string;
  readonly title: string;
  readonly body: ReadonlyArray<string>;
  readonly button_link: string;
  readonly button_text: string;
  readonly promotion_id: string;
  readonly background_color: string;
  readonly banner_img: PbBannerImage;
  readonly text_color: string;
};

export type GetHomePageBannerResult = {
  readonly promo_message: PromoBannerMessage | null | undefined;
  readonly automated_campaigns: ReadonlyArray<AutomatedCampaign>;
  readonly refund_assurance: {
    readonly guaranteed_refund_rate: number;
    readonly show_refund_assurance_banner: boolean;
  };
  readonly show_fbw_incentive_banner: boolean;
};

// params_type
export type GetHomePageModalParams = {
  readonly params_type: string;
};

// ==============================================
// product-boost/enable-campaign-bulk
// ==============================================

export const PB_ENABLE_CAMPAIGN_BULK_ENDPOINT =
  "/api/product-boost/enable-campaign-bulk";

export type BulkEnableAutomatedCampaignParams = {
  readonly campaign_ids: ReadonlyArray<string>;
  readonly caller_source: string;
};

// ==============================================
// product-boost/duplicate-campaign-bulk
// ==============================================
export const PB_DUPLICATE_CAMPAIGN_BULK_ENDPOINT =
  "/api/product-boost/duplicate-campaign-bulk";

export type BulkDuplicateAutomatedCampaignParams = {
  readonly campaign_ids: ReadonlyArray<string>;
};

// ==============================================
// product-boost/bulk-add-campaign-budget
// ==============================================

export const PB_ADD_CAMPAIGN_BUDGET_BULK_ENDPOINT =
  "/api/product-boost/bulk-add-campaign-budget";

export type BulkIncreaseCampaignBudgetParams = {
  readonly add_budget_data: string;
  readonly max_spending_displayed: number;
};
