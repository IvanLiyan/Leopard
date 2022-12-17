import { gql } from "@apollo/client";
import {
  CurrencyValue,
  ProductSchema,
  SalesPerformanceStats,
  ProductCatalogSchemaProductsArgs,
  Datetime,
  ProductStatsWeeklyArgs,
  ProductCatalogSchema,
  MerchantSchema,
} from "@schema";

export const PERFORMANCE_BREAKDOWN_DATA_QUERY = gql`
  query Sales_PerformanceBreakdownDataQuery(
    $offset: Int
    $limit: Int
    $sort: ProductSort
    $weeks_from_the_latest: Int
  ) {
    currentMerchant {
      primaryCurrency
    }
    productCatalog {
      productCountV2
      productsV2(limit: $limit, offset: $offset, sort: $sort) {
        id
        stats {
          weekly(weeksFromTheLatest: $weeks_from_the_latest) {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            sales {
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
  }
`;

export type PickedSalesBreakdown = {
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode">;
} & Pick<
  SalesPerformanceStats,
  | "productImpressions"
  | "addToCart"
  | "addToCartConversion"
  | "orders"
  | "checkoutConversion"
>;

export type PickedProductsV2 = {
  readonly stats: {
    readonly weekly?: {
      readonly sales: PickedSalesBreakdown;
    } & {
      readonly startDate: Pick<Datetime, "mmddyyyy">;
      readonly endDate: Pick<Datetime, "mmddyyyy">;
    };
  };
} & Pick<ProductSchema, "id">;

export type SalesProductBreakdownResponseData = {
  readonly productCatalog?: Pick<ProductCatalogSchema, "productCountV2"> & {
    readonly productsV2: ReadonlyArray<PickedProductsV2>;
  };
  readonly currentMerchant?: Pick<MerchantSchema, "primaryCurrency">;
};

export type BreakdownRequestArgs = {
  readonly weeks_from_the_latest: ProductStatsWeeklyArgs["weeksFromTheLatest"];
} & Pick<ProductCatalogSchemaProductsArgs, "offset" | "sort" | "limit">;

export type AugmentedSalesBreakdown = PickedSalesBreakdown & {
  readonly id: ProductSchema["id"];
  readonly startDate?: Pick<Datetime, "mmddyyyy">;
  readonly endDate?: Pick<Datetime, "mmddyyyy">;
};
