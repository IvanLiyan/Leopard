import { gql } from "@apollo/client";
import {
  CurrencyValue,
  Datetime,
  MerchantSchema,
  MerchantStatsWeeklyArgs,
  ProductPerformanceStats,
} from "@schema";

export const PERFORMANCE_PRODUCT_DATA_QUERY = gql`
  query Product_PerformanceProductDataQuery($weeks: Int!) {
    currentMerchant {
      primaryCurrency
      storeStats {
        weekly(weeks: $weeks) {
          product {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            activeProducts
            activeSkus
            skusPerProduct
            averagePrice {
              amount
              currencyCode
            }
            averageShippingPrice {
              amount
              currencyCode
            }
            priceToShippingRatio
            averageAdditonalImagesPerProduct
            productImpressions
            gmv {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export type PickedProduct = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly averagePrice?: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly averageShippingPrice?: Pick<
    CurrencyValue,
    "amount" | "currencyCode"
  >;
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode">;
} & Pick<
  ProductPerformanceStats,
  | "activeProducts"
  | "activeSkus"
  | "skusPerProduct"
  | "priceToShippingRatio"
  | "averageAdditonalImagesPerProduct"
  | "productImpressions"
>;

export type ProductDataQueryResponse = {
  readonly currentMerchant?: Pick<MerchantSchema, "primaryCurrency"> & {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly product: PickedProduct;
      }>;
    };
  };
};

export type ProductDataQueryArguments = MerchantStatsWeeklyArgs;
