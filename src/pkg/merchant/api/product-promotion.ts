/* Type Import */
import {
  CurrencyValue,
  Datetime,
  Maybe,
  ProductPromotionDailyStats,
  ProductPromotionLifetimeStats,
  ProductPromotionPeriodStats,
  ProductPromotionSchema,
  ProductPromotionStatus,
} from "@schema/types";

export type ProductPromotionLifetimeGraphType = {
  readonly date: string;
  readonly impressions?: number | null | undefined;
  readonly sales?: number | null | undefined;
  readonly gmv?: number | null | undefined;
  readonly promotionStatus: string;
};

export type ProductPromotionLifetimeStatsType = Pick<
  ProductPromotionLifetimeStats,
  "sales"
> & {
  readonly gmv: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly spend: Pick<CurrencyValue, "amount" | "currencyCode">;
};

export type ProductPromotionType = Pick<
  ProductPromotionSchema,
  "productId" | "promotionStatus"
> & {
  readonly dailyPromotionBudget: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly lastUpdateDate?: Maybe<Pick<Datetime, "formatted">>;
  readonly lifetimeStats: ProductPromotionLifetimeStatsType;
  readonly intenseBoost?: Maybe<boolean>;
};

// A flattened version of the above type that can be displayed in tables
export type ProductPromotionRowType = {
  readonly product_id: string;
  readonly lifetime_sales: number;
  readonly lifetime_gmv: number;
  readonly lifetime_spend: number;
  readonly daily_max_budget: number;
  readonly daily_budget_state: ProductPromotionStatus;
  readonly daily_budget_update_date: string | null | undefined;
  readonly intense_boost: boolean | null | undefined;
};

export type ProductPromotionDailyStatsType = Pick<
  ProductPromotionDailyStats,
  "impressions" | "sales" | "promotionStatus"
> & {
  readonly date: Pick<Datetime, "formatted">;
  readonly promotionSpending?: Maybe<
    Pick<CurrencyValue, "amount" | "currencyCode">
  >;
};

export type ProductPromotionPerformanceType = Pick<
  ProductPromotionPeriodStats,
  "totalImpressions" | "totalSales"
> & {
  readonly startDate: Pick<Datetime, "unix">;
  readonly endDate: Pick<Datetime, "unix">;
  readonly dailyStats: ReadonlyArray<ProductPromotionDailyStatsType>;
  readonly totalPromotionSpending: Pick<
    CurrencyValue,
    "amount" | "currencyCode"
  >;
};

export type UpdateDailyBudgetCampaignConfirmationModalParams = {
  readonly content: string;
  readonly product_id: string;
  readonly old_budget: number;
  readonly new_budget: number;
  readonly intense_boost: boolean;
};
