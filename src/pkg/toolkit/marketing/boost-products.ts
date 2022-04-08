import {
  MerchantSchema,
  ProductSchema,
  CurrencyValue,
  PromotableProduct,
  MarketingMerchantPropertySchema,
  MarketingSpendingBreakdown,
} from "@schema/types";

export type BoostProductsMerchantSpending = Pick<
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

type PickedMarketingMerchantProperty = Pick<
  MarketingMerchantPropertySchema,
  "allowLocalizedCurrency" | "isFreeBudgetMerchant"
> & {
  readonly spending: BoostProductsMerchantSpending;
  readonly dailyMinBudget: Pick<CurrencyValue, "amount">;
};

export type BoostProductsInitialData = {
  readonly marketing: {
    readonly currentMerchant: PickedMarketingMerchantProperty;
  };
  readonly currentMerchant: Pick<MerchantSchema, "primaryCurrency">;
};

export type BoostableProduct = Pick<
  PromotableProduct,
  "isInTrendingCategory"
> & {
  readonly product: Pick<
    ProductSchema,
    "id" | "name" | "variationCount" | "sales" | "wishes" | "sku"
  >;
};
