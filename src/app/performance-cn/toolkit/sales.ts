import { gql } from "@gql";
import {
  CurrencyValue,
  SalesPerformanceStats,
  Datetime,
  MerchantSchema,
} from "@schema";

export const PERFORMANCE_AGGREGATE_DATA_QUERY = gql(`
  query Sales_PerformanceAggregateDataQuery($weeks: Int!) {
    currentMerchant {
      primaryCurrency
      storeStats {
        weekly(weeks: $weeks) {
          sales {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            productImpressions
            addToCart
            addToCartConversion
            orders
            checkoutConversion
            gmv {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`);
export type PickedSales = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode">;
} & Pick<
  SalesPerformanceStats,
  | "productImpressions"
  | "addToCart"
  | "addToCartConversion"
  | "orders"
  | "checkoutConversion"
>;

export type SalesAggregateResponseData = {
  readonly currentMerchant?: Pick<MerchantSchema, "primaryCurrency"> & {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly sales: PickedSales;
      }>;
    };
  };
};
