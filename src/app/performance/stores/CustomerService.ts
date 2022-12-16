import { observable, action } from "mobx";
import { gql } from "@apollo/client";
import {
  PaymentCurrencyCode,
  CurrencyValue,
  Datetime,
  CsPerformanceStats,
  Timedelta,
  ProductCatalogSchema,
  ProductCatalogSchemaProductsArgs,
  ProductSchema,
  ProductStatsWeeklyArgs,
  MerchantStatsWeeklyArgs,
} from "@schema";
import {
  AugmentedPrice,
  CountTableDataItem,
  countTableDataCurrencyAmount,
} from "@performance/toolkit/utils";

export type CustomerServiceAggregateBenchMark = {
  readonly benchmark: string;
  readonly refundRatio30d: string;
  readonly refundRatio93d: string;
  readonly chargebackRatio: string;
  readonly chargebackAmountRatio: string;
  readonly ticketRatio: string;
  readonly lateResponseRate30d: string;
  readonly customerSatisfaction: string;
};

export type CustomerServiceProductBreakdownBenchMark = {
  readonly benchmark: string;
  readonly refundRatio30d: string;
  readonly refundRatio93d: string;
};

export const CS_PERFORMANCE_AGGREGATE_DATA_QUERY = gql`
  query CustomerService_PerformanceAggregateDataQuery($weeks: Int!) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          cs {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
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
            chargeback
            chargebackRatio
            chargebackAmount {
              amount
              currencyCode
            }
            chargebackAmountRatio
            tickets
            ticketRatio
            lateResponseRate30d
            averageTicketResponseTime {
              hours
            }
            customerSatisfaction
          }
        }
      }
    }
  }
`;

type PickedCustomerServiceAggregate = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly chargebackAmount?: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly averageTicketResponseTime: Pick<Timedelta, "hours">;
} & Pick<
  CsPerformanceStats,
  | "orders"
  | "orders30d"
  | "refund30d"
  | "refundRatio30d"
  | "orders93d"
  | "refund93d"
  | "refundRatio93d"
  | "chargeback"
  | "chargebackRatio"
  | "chargebackAmountRatio"
  | "tickets"
  | "ticketRatio"
  | "lateResponseRate30d"
  | "customerSatisfaction"
  | "ticketRatio"
>;

export type AugmentedCustomerServiceAggregate = Omit<
  PickedCustomerServiceAggregate,
  "gmv"
> & {
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode"> &
    AugmentedPrice;
  readonly chargebackAmount?: Pick<CurrencyValue, "amount" | "currencyCode"> &
    AugmentedPrice;
};

export type CustomerServiceAggregateResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly cs: AugmentedCustomerServiceAggregate;
      }>;
    };
  };
};

export type CustomerServiceAggregateArgs = MerchantStatsWeeklyArgs;

export const CS_PERFORMANCE_BREAKDOWN_DATA_QUERY = gql`
  query CustomerService_PerformanceBreakdownDataQuery(
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

export type AugmentedCustomerServiceBreakdown = Omit<
  PickedCustomerServiceBreakdown,
  "gmv"
> & {
  readonly id: ProductSchema["id"];
  readonly gmv?: Pick<CurrencyValue, "amount" | "currencyCode"> &
    AugmentedPrice;
  readonly startDate?: Pick<Datetime, "mmddyyyy">;
  readonly endDate?: Pick<Datetime, "mmddyyyy">;
};

export type CustomerServiceProductBreakdownResponseData = {
  readonly productCatalog: Pick<ProductCatalogSchema, "productCountV2"> & {
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

class Store {
  /**
   * Store data across different management ends, such as user information
   */
  storeName = "performance-customer-service-store";

  @observable
  aggregateData: ReadonlyArray<AugmentedCustomerServiceAggregate> = [];

  @observable
  breakdownData: ReadonlyArray<AugmentedCustomerServiceBreakdown> = [];

  @observable
  aggregateCurrencyCode: PaymentCurrencyCode = "USD";

  @observable
  breakdownCurrencyCode: PaymentCurrencyCode = "USD";

  @observable
  breakdownDataTotalCount = 0;

  @observable
  pageNo = 0;

  @observable
  aggregateCNYFlag = false;

  @observable
  productCNYFlag = false;

  @action updateAggregateCurrencyCode(currencyCode: PaymentCurrencyCode) {
    this.aggregateCurrencyCode = currencyCode;
  }
  @action updateBreakdownCurrencyCode(currencyCode: PaymentCurrencyCode) {
    this.breakdownCurrencyCode = currencyCode;
  }

  @action updatePageNo(pageNo: number) {
    this.pageNo = pageNo;
  }

  @action
  updateAggregateData(data: CustomerServiceAggregateResponseData) {
    const customerServiceData = data?.currentMerchant?.storeStats?.weekly?.map(
      (week) => week.cs,
    );
    this.aggregateData = countTableDataCurrencyAmount(
      customerServiceData as unknown as ReadonlyArray<CountTableDataItem>, // cast is very dangerous but original code was not type safe. please do not repeat
      ["gmv", "chargebackAmount"],
    ) as unknown as ReadonlyArray<AugmentedCustomerServiceAggregate>;
    if (customerServiceData[0].gmv?.currencyCode === "CNY")
      this.aggregateCNYFlag = true;
  }

  @action
  updateBreakdownData(data: CustomerServiceProductBreakdownResponseData) {
    this.breakdownDataTotalCount = data.productCatalog.productCountV2;
    const productData = data.productCatalog.productsV2.map((product) => {
      const { weekly } = product.stats;
      return {
        id: product.id,
        startDate: weekly?.startDate,
        endDate: weekly?.endDate,
        ...weekly?.cs,
      };
    });
    this.breakdownData = countTableDataCurrencyAmount(
      productData as unknown as ReadonlyArray<CountTableDataItem>, // cast is very dangerous but original code was not type safe. please do not repeat
      ["gmv"],
    ) as unknown as ReadonlyArray<AugmentedCustomerServiceBreakdown>; // cast is very dangerous but original code was not type safe. please do not repeat;

    if (productData[0].gmv?.currencyCode === "CNY") this.productCNYFlag = true;
  }
}

export default new Store();
