import { gql } from "@apollo/client";
import {
  CurrencyValue,
  Datetime,
  CsPerformanceStats,
  ProductCatalogSchema,
  ProductCatalogSchemaProductsArgs,
  ProductSchema,
  ProductStatsWeeklyArgs,
  MerchantSchema,
} from "@schema";

export type CustomerServiceProductBreakdownBenchMark = {
  readonly benchmark: string;
  readonly refundRatio30d: string;
  readonly refundRatio93d: string;
};

export const CS_PERFORMANCE_BREAKDOWN_DATA_QUERY = gql`
  query CustomerService_PerformanceBreakdownDataQuery(
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
            cs {
              gmv {
                amount
                currencyCode
              }
              orders
              orders30d
              refund30d
              refundRatio30d
              orders93d
              refund93d
              refundRatio93d
              averageRating30d
            }
          }
        }
      }
    }
  }
`;

type PickedCustomerServiceBreakdown = {
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode">;
} & Pick<
  CsPerformanceStats,
  | "orders"
  | "orders30d"
  | "refund30d"
  | "refundRatio30d"
  | "orders93d"
  | "refund93d"
  | "refundRatio93d"
  | "averageRating30d"
>;

export type CustomerServiceProductBreakdownResponseData = {
  readonly currentMerchant?: Pick<MerchantSchema, "primaryCurrency">;
  readonly productCatalog?: Pick<ProductCatalogSchema, "productCountV2"> & {
    readonly productsV2: ReadonlyArray<
      {
        readonly stats: {
          readonly weekly?: {
            readonly cs: PickedCustomerServiceBreakdown;
          } & {
            readonly startDate: Pick<Datetime, "mmddyyyy">;
            readonly endDate: Pick<Datetime, "mmddyyyy">;
          };
        };
      } & Pick<ProductSchema, "id">
    >;
  };
};

export type BreakdownRequestArgs = {
  readonly weeks_from_the_latest: ProductStatsWeeklyArgs["weeksFromTheLatest"];
} & Pick<ProductCatalogSchemaProductsArgs, "offset" | "sort" | "limit">;

export type AugmentedCustomerServiceBreakdown =
  PickedCustomerServiceBreakdown & {
    readonly id: ProductSchema["id"];
    readonly startDate?: Pick<Datetime, "mmddyyyy">;
    readonly endDate?: Pick<Datetime, "mmddyyyy">;
  };
