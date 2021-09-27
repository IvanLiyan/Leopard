import { gql } from "@apollo/client/core";
import {
  ProductPromotionSchema,
  ProductPromotionRefundAssuranceStats,
  CurrencyValue,
  Datetime,
  MarketingServiceSchema,
  ProductSchema,
  MarketingServiceSchemaProductPromotionsCountArgs,
  ProductPromotionRefundAssuranceType,
  RefundAssuranceConstants,
} from "@schema/types";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

export const GET_REFUND_ASSURANCE_PRODUCTS = gql`
  query RefundAssurance_GetRefundAssuranceProducts(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: ProductPromotionSearchType
    $refundAssuranceType: ProductPromotionRefundAssuranceType
  ) {
    marketing {
      productPromotions(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        refundAssuranceType: $refundAssuranceType
      ) {
        productId
        product {
          name
        }
        refundAssurance {
          topLevelStats {
            refundRate
            advancedLogisticsOrdersCount
            refundedAdvancedLogisticsOrdersCount
            refundAdvancedLogisticsGmv {
              display
            }
            advancedLogisticsGmv {
              display
            }
            creditIssued {
              display
            }
            creditIssuedStatus
            spend {
              display
            }
          }
          monthlyStats {
            refundRate
            refundedAdvancedLogisticsOrdersCount
            advancedLogisticsOrdersCount
            advancedLogisticsGmv {
              display
            }
            refundAdvancedLogisticsGmv {
              display
            }
            creditIssued {
              display
            }
            creditIssuedStatus
            month {
              formatted(fmt: "Y MMM")
            }
            spend {
              display
            }
          }
        }
      }
    }
  }
`;

export type PickedTopLevelRefundAssuranceStats = Pick<
  ProductPromotionRefundAssuranceStats,
  | "refundRate"
  | "refundedAdvancedLogisticsOrdersCount"
  | "advancedLogisticsOrdersCount"
  | "creditIssuedStatus"
> & {
  readonly refundAdvancedLogisticsGmv: Pick<CurrencyValue, "display">;
  readonly advancedLogisticsGmv: Pick<CurrencyValue, "display">;
  readonly creditIssued: Pick<CurrencyValue, "display">;
  readonly spend: Pick<CurrencyValue, "display">;
};

export type PickedMonthlyRefundAssuranceStats = Pick<
  ProductPromotionRefundAssuranceStats,
  | "refundRate"
  | "refundedAdvancedLogisticsOrdersCount"
  | "advancedLogisticsOrdersCount"
  | "creditIssuedStatus"
> & {
  readonly advancedLogisticsGmv: Pick<CurrencyValue, "display">;
  readonly refundAdvancedLogisticsGmv: Pick<CurrencyValue, "display">;
  readonly creditIssued: Pick<CurrencyValue, "display">;
  readonly month?: Pick<Datetime, "formatted">;
  readonly spend: Pick<CurrencyValue, "display">;
};

export type PickedProductPromotion = Pick<
  ProductPromotionSchema,
  "productId"
> & {
  readonly product: Pick<ProductSchema, "name">;
  readonly refundAssurance: {
    readonly topLevelStats: PickedTopLevelRefundAssuranceStats;
    readonly monthlyStats: ReadonlyArray<PickedMonthlyRefundAssuranceStats>;
  };
};

export type GetRefundAssuranceProductsResponse = {
  readonly marketing: {
    readonly productPromotions: ReadonlyArray<PickedProductPromotion>;
  };
};

export const GET_REFUND_ASSURANCE_PRODUCTS_COUNT = gql`
  query RefundAssurance_GetRefundAssuranceProductsCount(
    $query: String
    $searchType: ProductPromotionSearchType
    $refundAssuranceType: ProductPromotionRefundAssuranceType
  ) {
    marketing {
      productPromotionsCount(
        query: $query
        searchType: $searchType
        refundAssuranceType: $refundAssuranceType
      )
    }
  }
`;

export type GetRefundAssuranceProductsCountResponse = {
  readonly marketing: Pick<MarketingServiceSchema, "productPromotionsCount">;
};

export type GetRefundAssuranceProductsCountInput = Pick<
  MarketingServiceSchemaProductPromotionsCountArgs,
  "query" | "searchType" | "refundAssuranceType"
>;

export type RefundAssuranceInitialData = {
  readonly marketing: {
    readonly currentMerchant: {
      readonly refundAssuranceConstants: Pick<
        RefundAssuranceConstants,
        "guaranteedRefundRate" | "spendDiscountFactor"
      >;
    };
  };
};

export const PageLimitOptions = [10, 50, 100];

export const LearnMoreLink = zendeskURL("1260804150329");
const MaximumRefundCoverageLength = 6;

export const TabDescriptions: {
  [refundType in ProductPromotionRefundAssuranceType]: string;
} = {
  ELIGIBLE:
    i`Products included in the Advanced Logistics Program ` +
    i`are eligible for ProductBoost Refund Credit if ` +
    i`merchants create ProductBoost campaigns for them. ` +
    i`View the order refund activity of your eligible ` +
    i`products and corresponding ProductBoost Credit ` +
    i`received, and create campaigns to receive more ` +
    i`potential ProductBoot Credit.`,
  OTHER:
    i`To take advantage of ProductBoost Refund ` +
    i`Assurance and mitigate refund risks, ` +
    i`create ProductBoost campaigns for the following` +
    i` products included in the Advanced Logistics ` +
    i`Program now so that they become eligible to ` +
    i`receive ProductBoost Credit. The more ProductBoost` +
    i` spend, the more ProductBoost Credit ` +
    i`you receive. [Learn more](${LearnMoreLink})`,
};

export const RefundAssuranceTooltip = {
  HEADER_DESC:
    i`Create ProductBoost campaigns for products included in the ` +
    i`Advanced Logistics Program. Increase your campaign spend to ` +
    i`obtain ProductBoost Credit specifically designed to mitigate ` +
    i`the impact of refunds on eligible Advanced Logistics Program ` +
    i`orders. The more ProductBoost spend, the more ProductBoost ` +
    i`Credit to receive. [Learn more](${LearnMoreLink})`,
  PRODUCT_LEVEL_GMV_COLUMN:
    i`Cumulative gross merchandising value ` +
    i`(i.e., total value of goods sold, including product ` +
    i`and shipping prices) of Advanced Logistics Program ` +
    i`orders generated from this product and placed by ` +
    i`customers during all months listed below.`,
  PRODUCT_LEVEL_SPEND_COLUMN:
    i`Cumulative Total Spend of ProductBoost campaigns including ` +
    i`this product during all months listed below (i.e., total cost ` +
    i`of paid impressions this product received through ProductBoost campaigns).`,
  PRODUCT_LEVEL_REFUND_RATE_COLUMN: i`The cumulative Refund GMV divided by the cumulative GMV.`,
  PRODUCT_LEVEL_REFUND_GMV_COLUMN:
    i`Cumulative gross merchandising value refunded for orders placed ` +
    i`by customers during all months listed below due to delays or ` +
    i`issues caused by the Advanced Logistics Program itself`,
  PRODUCT_LEVEL_CREDIT_RECEIVED_COLUMN: i`Cumulative ProductBoost Credit received during all months listed below.`,
  MONTHLY_LEVEL_SPEND_COLUMN:
    i`Total Spend of ProductBoost campaigns including this product during ` +
    i`the specified month (i.e., total cost of paid impressions this ` +
    i`product received per month through ProductBoost campaigns)`,
  MONTHLY_LEVEL_GMV_COLUMN:
    i`Gross merchandising value (i.e., total value of goods sold, ` +
    i`including product and shipping prices) of Advanced Logistics` +
    i`Program orders generated from this product and placed by customers` +
    i` during the specified month`,
  MONTHLY_LEVEL_REFUND_GMV_COLUMN:
    i`Gross merchandising value refunded for orders placed by customers ` +
    i`during the specified month due to delays or issues caused by the Advanced` +
    i` Logistics Program itself. As refunds could occur long after an ` +
    i`order is placed, refund GMV for a specified month ` +
    i`shown in this table may fluctuate for up to ${MaximumRefundCoverageLength} months after ` +
    i`the end of that specified month. [Learn more](${LearnMoreLink})`,
  MONTHLY_LEVEL_ORDERS_COLUMN:
    i`Number of Advanced Logistics Program orders generated ` +
    i`from this product and placed ` +
    i`by customers during the specified month`,
  MONTHLY_LEVEL_REFUND_ORDERS_COLUMN:
    i`Number of refunds occured for Advanced Logistics orders ` +
    i`placed by customers during ` +
    i`the specified month due to delays or issues caused by the Advanced ` +
    i`Logistics Program itself. As refunds could occur long after an order is placed ` +
    i`by customers, refund orders for a specified month shown in this ` +
    i`table may fluctuate for up to ${MaximumRefundCoverageLength} months` +
    i` after the end of that specified month`,
  MONTHLY_LEVEL_REFUND_RATE_COLUMN: i`The monthly Refund GMV divided by the monthly GMV`,
};
