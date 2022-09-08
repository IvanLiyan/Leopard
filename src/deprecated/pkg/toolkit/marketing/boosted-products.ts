import {
  Datetime,
  ProductSchema,
  CurrencyValue,
  ProductPromotionSchema,
  MarketingImpressionDailyStats,
  MarketingPeriodImpressionStats,
  MarketingSpendingBreakdown,
  MarketingMerchantPropertySchema,
} from "@schema/types";

export type BoostedProductsMerchantSpending = Pick<
  MarketingSpendingBreakdown,
  "promotionLoanDescription"
> & {
  readonly accountBalance: Pick<CurrencyValue, "display">;
  readonly promotionLoan: Pick<CurrencyValue, "display">;
  readonly promotionBalance: Pick<CurrencyValue, "display">;
  readonly promotionCredit: Pick<CurrencyValue, "display">;
  readonly budgetAvailable: Pick<
    CurrencyValue,
    "display" | "amount" | "currencyCode"
  >;
  readonly pending: Pick<CurrencyValue, "display">;
};

export type PickedMerchantProperty = Pick<
  MarketingMerchantPropertySchema,
  "isFreeBudgetMerchant"
> & {
  readonly spending: BoostedProductsMerchantSpending;
  readonly dailyMinBudget: Pick<CurrencyValue, "amount" | "display">;
};

export type BoostedProductsInitialData = {
  readonly marketing: {
    readonly currentMerchant: PickedMerchantProperty;
  };
  readonly currentMerchant: {
    readonly signupTime: Pick<Datetime, "unix">;
  };
};

export type BoostedProductType = Pick<
  ProductPromotionSchema,
  "promotionStatus"
> & {
  readonly product: Pick<
    ProductSchema,
    "id" | "name" | "sku" | "variationCount" | "isRemoved"
  > & {
    readonly createTime: Pick<Datetime, "unix">;
  };
  readonly dailyPromotionBudget: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly lifetimeStats: {
    readonly spend: Pick<CurrencyValue, "amount" | "display">;
    readonly gmv: Pick<CurrencyValue, "amount" | "display">;
  };
};

export type PickedImpressionStats = Pick<
  MarketingImpressionDailyStats,
  "impressions"
> & {
  readonly date: Pick<Datetime, "formatted">;
};

export type ImpressionOverviewStatsResponseType = {
  readonly marketing: {
    readonly impressionStats: Pick<
      MarketingPeriodImpressionStats,
      "totalImpressions"
    > & {
      readonly impressionDailyStats: ReadonlyArray<PickedImpressionStats>;
    };
  };
};
