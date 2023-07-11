import { observable, action } from "mobx";
import { gql } from "@gql";
import {
  Datetime,
  Timedelta,
  MerchantStatsWeeklyArgs,
  TrackingPerformanceStats,
  DeliveryPerformanceStats,
} from "@schema";

export const SHIPPING_PERFORMANCE_DATA = gql(`
  query ShippingPerformanceShippingDataQuery($weeks: Int!) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          tracking {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            ordersFulfilled
            averageClaimedFulfillmentTime {
              hours
            }
            averageFulfillmentTime {
              hours
            }
            ordersWithValidTracking
            validTrackingRate
            preFulfillmentCancellations
            preFulfillmentCancellationRate
            lateConfirmedFulfillment
            lateConfirmedFulfillmentRate
          }
          delivery {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            ordersConfirmedDelivered
            ordersConfirmedDeliveredRate
            shippingTime {
              days
            }
            timeToDoor {
              days
            }
          }
        }
      }
    }
  }
`);

type PickedProductTracking = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly averageClaimedFulfillmentTime: Pick<Timedelta, "hours">;
  readonly averageFulfillmentTime: Pick<Timedelta, "hours">;
} & Pick<
  TrackingPerformanceStats,
  | "ordersFulfilled"
  | "ordersWithValidTracking"
  | "validTrackingRate"
  | "preFulfillmentCancellations"
  | "preFulfillmentCancellationRate"
  | "lateConfirmedFulfillment"
  | "lateConfirmedFulfillmentRate"
>;

type PickedProductDelivery = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly shippingTime: Pick<Timedelta, "days">;
  readonly timeToDoor: Pick<Timedelta, "days">;
} & Pick<
  DeliveryPerformanceStats,
  "ordersConfirmedDelivered" | "ordersConfirmedDeliveredRate"
>;

export type ShippingDataQueryResponse = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly tracking: PickedProductTracking;
        readonly delivery: PickedProductDelivery;
      }>;
    };
  };
};

export type ShippingDataQueryArguments = MerchantStatsWeeklyArgs;

export type AugmentedShipping = PickedProductTracking &
  Omit<PickedProductDelivery, "startDate" | "endDate">;

export type ShippingBenchMark = {
  readonly timePeriod: string;
  readonly averageClaimedFulfillmentTime: string;
  readonly averageFulfillmentTime: string;
  readonly validTrackingRate: string;
  readonly preFulfillmentCancellationRate: string;
  readonly lateConfirmedFulfillmentRate: string;
  readonly shippingTime: string;
  readonly timeToDoor: string;
};

class Store {
  readonly storeName = "shipping-dest-performance-store";

  @observable
  shippingData: ReadonlyArray<AugmentedShipping> = [];

  @action
  updateShippingData(data: ShippingDataQueryResponse) {
    const weeklyData = data?.currentMerchant?.storeStats?.weekly;
    this.shippingData = weeklyData.map((item) => {
      const { tracking, delivery } = item;
      return {
        ...tracking,
        ...delivery,
      };
    });
  }
}

export default new Store();
