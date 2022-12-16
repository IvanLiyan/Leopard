import { observable, action } from "mobx";
import { gql } from "@apollo/client";
import {
  ProductCatalogSchemaProductsArgs,
  RefundPerformanceStats,
  ProductSchema,
  Datetime,
  ProductStatsWeeklyArgs,
} from "@schema";

export type RefundAggregateBenchMark = {
  readonly benchMark: string;
  readonly refundRate: number;
};

export const PERFORMANCE_AGGREGATE_DATA_QUERY = gql`
  query Refund_PerformanceAggregateDataQuery($weeks: Int!) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          refund {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            refunds
            refundRate
            refundRatePercentile
            itemNotMatchingListingPercentage
            itemNotFitPercentage
            shippingTakeTooLongPercentage
            itemDamagedPercentage
            receivedWrongItemPercentage
            itemReturnedPercentage
            itemNotWorkPercentage
            failToFulfillPercentage
            deliverWrongAddressPercentage
            incompleteOrderPercentage
          }
        }
      }
    }
  }
`;

type PickedRefundAggregate = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
} & Pick<
  RefundPerformanceStats,
  | "refunds"
  | "refundRate"
  | "itemNotMatchingListingPercentage"
  | "itemNotFitPercentage"
  | "shippingTakeTooLongPercentage"
  | "itemReturnedPercentage"
  | "itemDamagedPercentage"
  | "itemNotWorkPercentage"
  | "receivedWrongItemPercentage"
  | "failToFulfillPercentage"
  | "deliverWrongAddressPercentage"
  | "incompleteOrderPercentage"
  | "refundRatePercentile"
>;

export type AugmentedRefundAggregate = PickedRefundAggregate;
export type RefundAggregateResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly refund: AugmentedRefundAggregate;
      }>;
    };
  };
};

export const PERFORMANCE_BREAKDOWN_DATA_QUERY = gql`
  query Refund_PerformanceBreakdownDataQuery(
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
            refund {
              refunds
              itemNotMatchingListingPercentage
              itemNotFitPercentage
              shippingTakeTooLongPercentage
              itemDamagedPercentage
              receivedWrongItemPercentage
              itemReturnedPercentage
              itemNotWorkPercentage
              failToFulfillPercentage
              deliverWrongAddressPercentage
              incompleteOrderPercentage
            }
          }
        }
        isReturnsEnabled
      }
    }
  }
`;

type PickedRefundBreakdown = Pick<
  RefundPerformanceStats,
  | "refunds"
  | "itemNotMatchingListingPercentage"
  | "itemNotFitPercentage"
  | "shippingTakeTooLongPercentage"
  | "itemReturnedPercentage"
  | "itemDamagedPercentage"
  | "itemNotWorkPercentage"
  | "receivedWrongItemPercentage"
  | "failToFulfillPercentage"
  | "deliverWrongAddressPercentage"
  | "incompleteOrderPercentage"
>;

export type AugmentedRefundBreakdown = {
  readonly startDate?: Pick<Datetime, "mmddyyyy">;
  readonly endDate?: Pick<Datetime, "mmddyyyy">;
} & PickedRefundBreakdown &
  Pick<ProductSchema, "id" | "isReturnsEnabled">;

export type BreakdownRequestArgs = {
  readonly weeks_from_the_latest: ProductStatsWeeklyArgs["weeksFromTheLatest"];
} & Pick<ProductCatalogSchemaProductsArgs, "offset" | "sort" | "limit">;

export type RefundBreakdownResponseData = {
  readonly productCatalog: {
    readonly productCountV2: number;
    readonly productsV2: ReadonlyArray<
      {
        readonly stats: {
          readonly weekly?: {
            readonly startDate: Pick<Datetime, "mmddyyyy">;
            readonly endDate: Pick<Datetime, "mmddyyyy">;
          } & {
            readonly refund: PickedRefundBreakdown;
          };
        };
      } & Pick<ProductSchema, "id" | "isReturnsEnabled">
    >;
  };
};

class Store {
  readonly storeName = "performance-refund-store";

  @observable
  tabIndex = 0;

  @observable
  aggregateData: ReadonlyArray<AugmentedRefundAggregate> = [];

  @observable
  breakdownData: ReadonlyArray<AugmentedRefundBreakdown> = [];

  @observable
  breakdownDataTotalCount = 0;

  @observable
  pageNo = 0;

  @action
  changeTab(tabIndex: number) {
    this.tabIndex = tabIndex;
  }

  @action updatePageNo(pageNo: number) {
    this.pageNo = pageNo;
  }

  @action
  updateAggregateData(data: RefundAggregateResponseData) {
    const weeklyData = data?.currentMerchant?.storeStats?.weekly;
    this.aggregateData = weeklyData.map((item) => item.refund);
  }
  @action
  updateBreakdownData(data: RefundBreakdownResponseData) {
    this.breakdownDataTotalCount = data.productCatalog.productCountV2;
    this.breakdownData = data?.productCatalog?.productsV2.map((item) => {
      const { weekly } = item.stats;
      return {
        id: item.id,
        isReturnsEnabled: item.isReturnsEnabled,
        startDate: weekly?.startDate,
        endDate: weekly?.endDate,
        ...weekly?.refund,
      };
    });
  }
}

export default new Store();
