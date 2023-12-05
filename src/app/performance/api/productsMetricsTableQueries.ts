import { gql } from "@gql";
import {
  MerchantSchema,
  ProductCatalogSchema,
  ProductSchema,
  CurrencyValue,
  ProductTotalStats,
  ProductCatalogSchemaProductsV2Args,
  ProductCatalogSchemaProductsV3Args,
} from "@schema";

export const PRODUCTS_METRICS_TABLE_COMPONENT_QUERY = gql(`
  query ProductsMetricsTableComponentQuery {
    currentMerchant {
      state
    }
  }
`);

export type ProductsMetricsTableComponentQueryResponse = {
  readonly currentMerchant?: Pick<MerchantSchema, "state"> | null;
};

export const PRODUCTS_METRICS_TABLE_TABLE_QUERY = gql(`
  query ProductsMetricsTableTableQuery(
    $offset: Int!
    $limit: Int!
    $days: Int!
    $searchType: ProductSearchType
    $query: String
  ) {
    productCatalog {
      productCountV2(searchType: $searchType, query: $query, state: ACTIVE)
      productsV2(
        limit: $limit
        offset: $offset
        searchType: $searchType
        query: $query
        sort: { order: DESC, field: SALES }
        state: ACTIVE
      ) {
        sku
        name
        id
        variations {
          price {
            amount
            display
          }
        }
        stats {
          totals(coreMetricsOnly: true, days: $days) {
            gmv {
              amount
              display
            }
            orders
            impressions
          }
        }
      }
    }
  }
`);

export type ProductsMetricsTableTableQueryResponse = {
  readonly productCatalog?:
    | (Pick<ProductCatalogSchema, "productCountV2"> & {
        readonly productsV2: ReadonlyArray<
          Pick<ProductSchema, "sku" | "name" | "id"> & {
            readonly variations: ReadonlyArray<{
              readonly price: Pick<CurrencyValue, "amount" | "display">;
            }>;
            readonly stats: {
              readonly totals: Pick<
                ProductTotalStats,
                "orders" | "impressions"
              > & {
                readonly gmv: Pick<CurrencyValue, "amount" | "display">;
              };
            };
          }
        >;
      })
    | null;
};

export type ProductsMetricsTableTableQueryVariables =
  ProductCatalogSchemaProductsV2Args & {
    readonly days: number;
  };

export const PRODUCTS_METRICS_PERFORMANCE_TABLE_QUERY = gql(`
query ProductsMetricsPerformanceTableQuery($offset: Int!, $limit: Int!, $days: Int!, $searchType: ProductSearchType, $query: String, $withPerformance: Boolean!, $sort: PerformanceProductSort) {
  productCatalog {
    productCountV3(withPerformance: $withPerformance)
    productsV3(
      limit: $limit
      offset: $offset
      sort: $sort
      withPerformance: $withPerformance
      days: $days
      searchType: $searchType
      query: $query
    ) {
      sku
      name
      id
      variations {
        price {
          amount
          display
        }
      }
      stats {
        totals(coreMetricsOnly: true, days: $days) {
          gmv {
            amount
            display
          }
          orders
          impressions
        }
      }
    }
  }
}
`);

export type ProductsMetricsPerformanceTableResponse = {
  readonly productCatalog?:
    | (Pick<ProductCatalogSchema, "productCountV3"> & {
        readonly productsV3: ReadonlyArray<
          Pick<ProductSchema, "sku" | "name" | "id"> & {
            readonly variations: ReadonlyArray<{
              readonly price: Pick<CurrencyValue, "amount" | "display">;
            }>;
            readonly stats: {
              readonly totals: Pick<
                ProductTotalStats,
                "orders" | "impressions"
              > & {
                readonly gmv: Pick<CurrencyValue, "amount" | "display">;
              };
            };
          }
        >;
      })
    | null;
};

export type ProductsMetricsPerformanceTableRequest =
  ProductCatalogSchemaProductsV3Args;
