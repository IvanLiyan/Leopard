import { observable, action } from "mobx";
import { gql } from "@apollo/client";
import {
  PaymentCurrencyCode,
  CurrencyValue,
  ProductSchema,
  SalesPerformanceStats,
  ProductCatalogSchemaProductsArgs,
  Datetime,
  ProductStatsWeeklyArgs,
  ProductCatalogSchema,
} from "@schema";
import {
  AugmentedPrice,
  CountTableDataItem,
  countTableDataCurrencyAmount,
} from "@performance/toolkit/utils";

export const PERFORMANCE_AGGREGATE_DATA_QUERY = gql`
  query Sales_PerformanceAggregateDataQuery($weeks: Int!) {
    currentMerchant {
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
`;
type PickedSalesAggregate = {
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

export type AugmentedSalesAggregate = Omit<PickedSalesAggregate, "gmv"> & {
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode"> &
    AugmentedPrice;
};

export type SalesAggregateResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly sales: PickedSalesAggregate;
      }>;
    };
  };
};

export const PERFORMANCE_BREAKDOWN_DATA_QUERY = gql`
  query Sales_PerformanceBreakdownDataQuery(
    $offset: Int
    $limit: Int
    $sort: ProductSort
    $weeks_from_the_latest: Int
  ) {
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

type PickedSalesBreakdown = {
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode">;
} & Pick<
  SalesPerformanceStats,
  | "productImpressions"
  | "addToCart"
  | "addToCartConversion"
  | "orders"
  | "checkoutConversion"
>;

export type AugmentedSalesBreakdown = Omit<PickedSalesBreakdown, "gmv"> & {
  readonly id: ProductSchema["id"];
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode"> &
    AugmentedPrice;
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
};

export type SalesProductBreakdownResponseData = {
  readonly productCatalog: Pick<ProductCatalogSchema, "productCountV2"> & {
    readonly productsV2: ReadonlyArray<
      {
        readonly stats: {
          readonly weekly: {
            readonly sales: PickedSalesBreakdown;
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

class Store {
  readonly storeName = "performance-sales-store";

  @observable
  aggregateData: ReadonlyArray<AugmentedSalesAggregate> = [];

  @observable
  breakdownData: ReadonlyArray<AugmentedSalesBreakdown> = [];

  @observable
  breakdownDataTotalCount = 0;

  @observable
  aggreagateCurrencyCode: PaymentCurrencyCode = "USD";

  @observable
  breakdownCurrencyCode: PaymentCurrencyCode = "USD";

  @observable
  aggregateCNYFlag = false;

  @observable
  productCNYFlag = false;

  @observable
  pageNo = 0;

  @action updateAggreagateCurrencyCode(currencyCode: PaymentCurrencyCode) {
    this.aggreagateCurrencyCode = currencyCode;
  }
  @action updateBreakdownCurrencyCode(currencyCode: PaymentCurrencyCode) {
    this.breakdownCurrencyCode = currencyCode;
  }

  @action updatePageNo(pageNo: number) {
    this.pageNo = pageNo;
  }

  @action
  updataAggregateData(data: SalesAggregateResponseData) {
    const salesData = data?.currentMerchant?.storeStats?.weekly?.map(
      (item) => item.sales,
    );
    this.aggregateData = countTableDataCurrencyAmount(
      salesData as unknown as ReadonlyArray<CountTableDataItem>, // cast is very dangerous but original code was not type safe. please do not repeat
      ["gmv"],
    ) as unknown as ReadonlyArray<AugmentedSalesAggregate>;
    if (salesData[0].gmv?.currencyCode === "CNY") this.aggregateCNYFlag = true;
  }

  @action
  updataBreakdownData(data: SalesProductBreakdownResponseData) {
    this.breakdownDataTotalCount = data.productCatalog.productCountV2;
    const productData = data.productCatalog.productsV2
      ?.filter((obj) => obj.stats.weekly)
      .map((product) => {
        const { startDate, endDate, sales } = product.stats.weekly;
        return {
          id: product.id,
          startDate,
          endDate,
          ...sales,
        };
      });
    if (productData.length === 0) {
      return;
    }
    this.breakdownData = countTableDataCurrencyAmount(
      productData as unknown as ReadonlyArray<CountTableDataItem>, // cast is very dangerous but original code was not type safe. please do not repeat
      ["gmv"],
    ) as unknown as ReadonlyArray<AugmentedSalesBreakdown>; // cast is very dangerous but original code was not type safe. please do not repeat;

    if (productData[0].gmv?.currencyCode === "CNY") this.productCNYFlag = true;
  }
}

export default new Store();
