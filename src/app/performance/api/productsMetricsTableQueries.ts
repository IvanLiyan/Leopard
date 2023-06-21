import { gql } from "@apollo/client";
import {
  MerchantSchema,
  ProductCatalogSchema,
  ProductSchema,
  CurrencyValue,
  ProductTotalStats,
  ProductCatalogSchemaProductsV2Args,
} from "@schema";

export const PRODUCTS_METRICS_TABLE_COMPONENT_QUERY = gql`
  query ProductsMetricsTableComponentQuery {
    currentMerchant {
      state
    }
  }
`;

export type ProductsMetricsTableComponentQueryResponse = {
  readonly currentMerchant?: Pick<MerchantSchema, "state"> | null;
};

export const PRODUCTS_METRICS_TABLE_TABLE_QUERY = gql`
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
`;

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
