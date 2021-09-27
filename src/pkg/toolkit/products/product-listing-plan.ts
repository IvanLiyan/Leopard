import numeral from "numeral";
import _ from "lodash";
import {
  CurrencyValue,
  Datetime,
  ProductListingTierSchema,
  ProductListingPlanTier,
  ProductListingFeeDetailsSchema,
  ProductTierPriceSchema,
  ProductListingPlanMonthlyProductMetrics,
  ProductListingPlanMonthlyProductMetricsBenchmark,
  ProductListingPlanProductMetrics,
  DatetimeInput,
} from "@schema/types";
import gql from "graphql-tag";

// Constants
export type PercentSentiment = "BETTER" | "WORSE" | "NORMAL";

export const PlpTierNames: {
  readonly [T in ProductListingPlanTier]: string;
} = {
  TIER_ONE: i`Free Plan`,
  TIER_TWO: i`Standard Plan`,
  TIER_THREE: i`Bulk Plan`,
};

export const formatProductAmount = (n: number) =>
  numeral(Math.round(n)).format("0,0").toString();

export const formatPlpPercentage = (n: number): string => {
  return `${n < 10 ? _.round(n, 1) : _.round(n)}`;
};

export const MonthsAgoToShow = 12;

const SalesNormalRangeLowerDiff = 9;
const SalesNormalRangeUpperDiff = 9;
const ImpressionsNormalRangeLowerDiff = 9;
const ImpressionsNormalRangeUpperDiff = 9;

export const getSalesSentiment = ({
  average,
  percent,
}: {
  readonly average?: number;
  readonly percent?: number;
}): PercentSentiment => {
  if (average == null || percent == null) {
    return "NORMAL";
  }
  if (percent < average - SalesNormalRangeLowerDiff) {
    return "WORSE";
  }
  if (percent > average + SalesNormalRangeUpperDiff) {
    return "BETTER";
  }
  return "NORMAL";
};

export const getImpressionsSentiment = ({
  average,
  percent,
}: {
  readonly average?: number;
  readonly percent?: number;
}): PercentSentiment => {
  if (average == null || percent == null) {
    return "NORMAL";
  }
  if (percent < average - ImpressionsNormalRangeLowerDiff) {
    return "WORSE";
  }
  if (percent > average + ImpressionsNormalRangeUpperDiff) {
    return "BETTER";
  }
  return "NORMAL";
};

export const DayNameMap: { readonly [day: number]: string | undefined } = {
  0: i`Sunday`,
  1: i`Monday`,
  2: i`Tuesday`,
  3: i`Wednesday`,
  4: i`Thursday`,
  5: i`Friday`,
  6: i`Saturday`,
};

export const MonthNameMap: { readonly [month: number]: string | undefined } = {
  0: i`January`,
  1: i`February`,
  2: i`March`,
  3: i`April`,
  4: i`May`,
  5: i`June`,
  6: i`July`,
  7: i`August`,
  8: i`September`,
  9: i`October`,
  10: i`November`,
  11: i`December`,
};

export const MonthNamePossessiveMap: {
  readonly [month: number]: string | undefined;
} = {
  0: i`January's`,
  1: i`February's`,
  2: i`March's`,
  3: i`April's`,
  4: i`May's`,
  5: i`June's`,
  6: i`July's`,
  7: i`August's`,
  8: i`September's`,
  9: i`October's`,
  10: i`November's`,
  11: i`December's`,
};

// Types
export type PickedCurrencValue = Pick<
  CurrencyValue,
  "amount" | "currencyCode" | "display"
>;

export type PickedProductListingTier = Pick<
  ProductListingTierSchema,
  "tier" | "higherBound" | "lowerBound"
> & {
  readonly price: PickedCurrencValue;
};

export type PlpTiers = {
  readonly tier1: PickedProductListingTier;
  readonly tier2: PickedProductListingTier;
  readonly tier3: PickedProductListingTier;
};

export type PlpInitialData = {
  readonly platformConstants: {
    readonly productListing: ReadonlyArray<PickedProductListingTier>;
  };
};

export type ProductTierPrice = {
  readonly tier: ProductListingPlanTier;
  readonly productCount: number;
  readonly price: Pick<CurrencyValue, "display" | "amount" | "currencyCode">;
};

export type ProductListingFeeDetails = {
  readonly currentProductTotal: number;
  readonly currentProductMax: number;
  readonly totalProductWithSale: number;
  readonly totalProductWithImpression: number;
  readonly priceBreakdownPerTier: ReadonlyArray<ProductTierPrice>;
};

// Query - Get product metrics for given month
export const GET_PRODUCT_METRICS_SUMMARY = gql`
  query ProductListingPlan_GetProductMetricsSummary(
    $startDate: DatetimeInput!
    $endDate: DatetimeInput!
    $billDate: DatetimeInput!
  ) {
    currentMerchant {
      productListingPlan {
        productTotal(startDate: $startDate, endDate: $endDate) {
          date {
            unix
          }
          count
        }
        bill(date: $billDate) {
          productMetrics {
            date {
              formatted(fmt: "M/d h:mm a")
            }
            totalProduct
            totalProductWithSale
            totalProductWithImpression
          }
          productMetricsBenchmark {
            avgSaleRatio
            avgImpressionRatio
          }
          currentProductMax
          priceBreakdownPerTier {
            productCount
            tier
            price {
              amount
              currencyCode
              display
            }
          }
        }
      }
    }
  }
`;

export type PickedProductCount = Pick<
  ProductListingPlanProductMetrics,
  "count"
> & {
  readonly date: Pick<Datetime, "unix">;
};
export type PickedPriceBreakdownPerTier = Pick<
  ProductTierPriceSchema,
  "productCount" | "tier"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
};

export type GetProductMetricsSummaryInputType = {
  readonly startDate: DatetimeInput;
  readonly endDate: DatetimeInput;
  readonly billDate: DatetimeInput;
};
export type GetProductMetricsSummaryResponseType = {
  readonly currentMerchant?: {
    readonly productListingPlan?: {
      readonly productTotal: ReadonlyArray<PickedProductCount>;
      readonly bill: Pick<
        ProductListingFeeDetailsSchema,
        "currentProductMax"
      > & {
        readonly priceBreakdownPerTier?: ReadonlyArray<
          PickedPriceBreakdownPerTier
        > | null;
        readonly productMetrics?:
          | (Pick<
              ProductListingPlanMonthlyProductMetrics,
              | "totalProduct"
              | "totalProductWithImpression"
              | "totalProductWithSale"
            > & {
              readonly date: Pick<Datetime, "formatted">;
            })
          | null;
        readonly productMetricsBenchmark?: Pick<
          ProductListingPlanMonthlyProductMetricsBenchmark,
          "avgImpressionRatio" | "avgSaleRatio"
        > | null;
      };
    } | null;
  } | null;
};
