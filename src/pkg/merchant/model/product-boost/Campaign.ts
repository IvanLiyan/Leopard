/* External Libraries */
import { observable } from "mobx";
import moment from "moment-timezone/moment-timezone";

/* Lego Toolkit */
import { CurrencyCode } from "@toolkit/currency";

import { Campaign as MongoCampaign } from "@merchant/api/product-boost";

/* Type Import */
import {
  MarketingCampaignState,
  MarketingFlexibleBudgetType,
  MarketingBonusBudgetType,
} from "@schema/types";

/* Merchant Model */
import Product from "@merchant/model/product-boost/Product";
import ProductModel from "@merchant/model/product-boost/Product";

// From AddBudgetNotificationSource
const EditRunningCampaignSource = 10;

export type MaxSpendingBreakdown = {
  balance: number;
  bonus: number;
  bonus_reason: number;
  is_payable: boolean;
  max_spending: number;
  bonus_reason_text?: string;
  product_boost_credit?: number;
  product_boost_balance: number;
  current_unpaid: number;
  currency: CurrencyCode;
};

export const formatDate = (
  date: Date | null | undefined
): string | null | undefined => {
  if (!date) {
    return null;
  }
  const mdate = moment(date);
  return mdate.format("YYYY-MM-DD");
};

export default class Campaign {
  id: string;
  oldBudget: number | null | undefined; // for comparison with newly set budget, will not change
  maxSpendingBreakdown: MaxSpendingBreakdown | null | undefined;

  @observable
  name: string | null | undefined;

  @observable
  budget: string | null | undefined;

  @observable
  merchantBudget: string | null | undefined;

  @observable
  startDate: Date | null | undefined = null;

  @observable
  endDate: Date | null | undefined = null;

  @observable
  products: Array<Product> | null | undefined;

  @observable
  isEvergreen: boolean | null | undefined;

  @observable
  isV2: boolean | null | undefined;

  @observable
  state: MarketingCampaignState | null | undefined;

  @observable
  merchantId: string | null | undefined;

  @observable
  scheduledAddBudgetEnabled: boolean | null | undefined;

  @observable
  scheduledAddBudgetAmount: string | null | undefined;

  @observable
  scheduledAddBudgetDays: Array<number> | null | undefined;

  @observable
  isNewState: boolean | null | undefined;

  @observable
  hasMaxboostProduct: boolean | null | undefined;

  @observable
  hasBeenPaid: boolean | null | undefined;

  @observable
  cappedSpend: number | null | undefined;

  @observable
  canShowInvoice: boolean | null | undefined;

  @observable
  trainingProgress: number | null | undefined;

  @observable
  discountFactor: number | null | undefined;

  @observable
  campaignSource: number | null | undefined;

  @observable
  createdFromEvergreen: boolean | null | undefined;

  @observable
  localizedCurrency: CurrencyCode;

  @observable
  minBudgetToAdd: number;

  @observable
  maxBudgetToAdd: number;

  @observable
  isBudgetDepleted: boolean | null | undefined;

  @observable
  isBudgetNearlyDepleted: boolean | null | undefined;

  @observable
  automatedState: number | null | undefined;

  @observable
  automatedType: number | null | undefined;

  @observable
  gmv: number;

  @observable
  flexibleBudgetEnabled: boolean | null | undefined;

  @observable
  minSpend: number | null | undefined;

  @observable
  flexibleBudgetType: MarketingFlexibleBudgetType | null | undefined;

  @observable
  intenseBoost: boolean | null | undefined;

  @observable
  isBonusBudgetCampaign: boolean;

  @observable
  bonusBudgetRate: number;

  @observable
  bonusBudget: number;

  @observable
  usedBonusBudget: number;

  @observable
  bonusBudgetType: MarketingBonusBudgetType;

  @observable
  eligibleBonusBudgetType: MarketingBonusBudgetType | null | undefined;

  constructor(params: {
    id: string;
    name?: string;
    budget?: string;
    oldBudget?: number;
    startDate?: Date;
    endDate?: Date;
    products?: ReadonlyArray<Product>;
    isEvergreen?: boolean;
    isV2?: boolean;
    state?: MarketingCampaignState;
    merchantId?: string;
    scheduledAddBudgetEnabled?: boolean;
    scheduledAddBudgetAmount?: string;
    scheduledAddBudgetDays?: ReadonlyArray<number>;
    isNewState?: boolean;
    hasMaxboostProduct?: boolean;
    maxSpendingBreakdown?: MaxSpendingBreakdown;
    hasBeenPaid?: boolean;
    cappedSpend?: number;
    canShowInvoice?: boolean;
    trainingProgress?: number;
    discountFactor?: number;
    campaignSource?: number;
    createdFromEvergreen?: boolean;
    localizedCurrency?: CurrencyCode;
    minBudgetToAdd?: number;
    maxBudgetToAdd?: number;
    isBudgetDepleted?: boolean;
    isBudgetNearlyDepleted?: boolean;
    automatedState?: number;
    automatedType?: number;
    gmv?: number;
    flexibleBudgetEnabled?: boolean;
    merchantBudget?: string;
    minSpend?: number;
    flexibleBudgetType?: MarketingFlexibleBudgetType;
    intenseBoost?: boolean;
    isBonusBudgetCampaign: boolean;
    bonusBudgetRate: number;
    bonusBudget: number;
    usedBonusBudget: number;
    bonusBudgetType: MarketingBonusBudgetType;
    eligibleBonusBudgetType?: MarketingBonusBudgetType;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.budget = params.budget;
    this.oldBudget = params.oldBudget;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.products = [...(params.products || [])];
    this.isEvergreen = params.isEvergreen;
    this.isV2 = params.isV2;
    this.state = params.state;
    this.merchantId = params.merchantId;
    this.scheduledAddBudgetEnabled = params.scheduledAddBudgetEnabled;
    this.scheduledAddBudgetAmount = params.scheduledAddBudgetAmount;
    this.scheduledAddBudgetDays = [...(params.scheduledAddBudgetDays || [])];
    this.isNewState = params.isNewState;
    this.hasMaxboostProduct = params.hasMaxboostProduct;
    this.maxSpendingBreakdown = params.maxSpendingBreakdown;
    this.hasBeenPaid = params.hasBeenPaid;
    this.cappedSpend = params.cappedSpend;
    this.canShowInvoice = params.canShowInvoice;
    this.trainingProgress = params.trainingProgress;
    this.discountFactor = params.discountFactor;
    this.campaignSource = params.campaignSource;
    this.createdFromEvergreen = params.createdFromEvergreen;
    this.localizedCurrency = params.localizedCurrency
      ? params.localizedCurrency
      : "USD";
    this.minBudgetToAdd = params.minBudgetToAdd ? params.minBudgetToAdd : 1.0;
    this.maxBudgetToAdd = params.maxBudgetToAdd
      ? params.maxBudgetToAdd
      : 10000.0;
    this.isBudgetDepleted = params.isBudgetDepleted;
    this.isBudgetNearlyDepleted = params.isBudgetNearlyDepleted;
    this.automatedState = params.automatedState;
    this.automatedType = params.automatedType;
    this.gmv = params.gmv ? params.gmv : 0;
    this.flexibleBudgetEnabled = params.flexibleBudgetEnabled;
    this.merchantBudget = params.merchantBudget;
    this.minSpend = params.minSpend;
    this.flexibleBudgetType = params.flexibleBudgetType;
    this.intenseBoost = params.intenseBoost;
    this.isBonusBudgetCampaign = params.isBonusBudgetCampaign;
    this.bonusBudgetRate = params.bonusBudgetRate;
    this.bonusBudget = params.bonusBudget;
    this.usedBonusBudget = params.usedBonusBudget;
    this.bonusBudgetType = params.bonusBudgetType;
    this.eligibleBonusBudgetType = params.eligibleBonusBudgetType;
  }

  static fromMongoCampaign(campaign: MongoCampaign) {
    const budget = campaign.max_budget.toFixed(2);
    const merchantBudget = campaign.merchant_budget.toFixed(2);
    const products = campaign.products.map((product) => {
      return new ProductModel({
        id: product.product_id,
        keywords: product.keywords,
        bid:
          typeof product.bid === "number"
            ? product.bid.toString()
            : product.bid,
        isMaxboost: product.is_maxboost,
      });
    });
    const isRunningState = campaign.state === "STARTED";
    const isEndedState = campaign.state === "ENDED";
    const showInvoice = isRunningState || isEndedState;
    return new Campaign({
      id: campaign.campaign_id,
      name: campaign.campaign_name,
      budget,
      merchantBudget,
      products,
      oldBudget: campaign.max_budget,
      startDate: new Date(campaign.start_time),
      endDate: new Date(campaign.end_time),
      isEvergreen: campaign.is_evergreen,
      isV2: campaign.is_v2,
      state: campaign.state,
      merchantId: campaign.merchant_id,
      hasMaxboostProduct: campaign.has_maxboost_product,
      cappedSpend: campaign.capped_spend,
      trainingProgress: campaign.training_progress,
      canShowInvoice: showInvoice,
      discountFactor: campaign.discount_factor,
      campaignSource: campaign.source,
      createdFromEvergreen: campaign.created_from_evergreen,
      localizedCurrency: campaign.localized_currency,
      minBudgetToAdd: campaign.min_budget_to_add,
      isBudgetDepleted: campaign.is_budget_depleted,
      isBudgetNearlyDepleted: campaign.is_budget_nearly_depleted,
      automatedState: campaign.automated_state,
      automatedType: campaign.automated_type,
      gmv: campaign.gmv,
      flexibleBudgetEnabled: campaign.flexible_budget_enabled,
      minSpend: campaign.min_spend,
      flexibleBudgetType: campaign.flexible_budget_type,
      intenseBoost: campaign.intense_boost,
      isBonusBudgetCampaign: campaign.is_bonus_budget_campaign,
      bonusBudgetRate: campaign.bonus_budget_rate,
      bonusBudget: campaign.localized_bonus_budget,
      usedBonusBudget: campaign.localized_used_bonus_budget,
      bonusBudgetType: campaign.bonus_budget_type,
    });
  }

  toJson() {
    return {
      campaign_id: this.id,
      campaign_name: this.name,
      max_budget: parseFloat(this.merchantBudget || ""),
      start_date: formatDate(this.startDate),
      end_date: formatDate(this.endDate),
      products: JSON.stringify(
        (this.products || []).map((product) => product.toJson())
      ),
      is_evergreen: this.isEvergreen,
      is_v2: this.isV2,
      num_products: (this.products || []).length,
      scheduled_add_budget_enabled: this.scheduledAddBudgetEnabled,
      scheduled_add_budget_amount: parseFloat(
        this.scheduledAddBudgetAmount || ""
      ),
      scheduled_add_budget_days: this.scheduledAddBudgetDays || [],
      flexible_budget_enabled: !!this.flexibleBudgetEnabled,
      intense_boost: this.intenseBoost || false,
      source: EditRunningCampaignSource,
    };
  }

  showIncreaseCampaignBudget() {
    let result = false;
    if (!this.products) {
      return result;
    }
    this.products.forEach((product) => {
      if (product.trending === true) {
        result = true;
      }
    });
    return result;
  }

  getBonusBudgetPromotionType() {
    return this.bonusBudgetType;
  }

  isCampaignEligibleForBonusBudget() {
    return this.getBonusBudgetPromotionType() != "NO_PROMOTION";
  }

  getBonusBudgetRate() {
    return this.bonusBudgetRate;
  }
}
