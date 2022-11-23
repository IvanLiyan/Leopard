import { observable, action } from "mobx";
import { gql } from "@apollo/client";
import {
  PaymentCurrencyCode,
  MerchantStatsDailyArgs,
  Datetime,
  Timedelta,
  MerchantTotalStats,
} from "@schema";
import { round } from "@core/toolkit/stringUtils";

const defaultStartDate = new Date(Date.now() - 30 * 24 * 3600 * 1000);
const defaultEndDate = new Date();

export const PERFORMANCE_CE_GRAPHS_DATA_QUERY = gql`
  query CustomerExperienceGraphs_PerformanceCeGraphsDataQuery(
    $days: Int!
    $offsetDays: Int!
    $averageFulfillmentTime: Boolean!
    $averageShippingTime: Boolean!
    $refundRate: Boolean!
    $averageShippingDelay: Boolean!
    $averageRating: Boolean!
  ) {
    currentMerchant {
      storeStats {
        daily(days: $days, offsetDays: $offsetDays) {
          startDate {
            mmddyyyy
          }
          endDate {
            mmddyyyy
          }
          averageFulfillmentTime @include(if: $averageFulfillmentTime) {
            days
          }
          refundRate30d @include(if: $refundRate)
          averageShippingTime @include(if: $averageShippingTime) {
            days
          }
          averageShippingDelay @include(if: $averageShippingDelay) {
            days
          }
          averageRating30d @include(if: $averageRating)
        }
      }
    }
  }
`;

export type PickedCEGraph = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly averageFulfillmentTime: Pick<Timedelta, "days">;
  readonly averageShippingTime: Pick<Timedelta, "days">;
  readonly averageShippingDelay: Pick<Timedelta, "days">;
} & Pick<MerchantTotalStats, "averageRating30d" | "refundRate30d">;

export type CEGraphArgs = {
  averageFulfillmentTime: boolean;
  averageShippingTime: boolean;
  refundRate: boolean;
  averageShippingDelay: boolean;
  averageRating: boolean;
} & Pick<MerchantStatsDailyArgs, "days" | "offsetDays">;

export type CEGraphResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly daily: ReadonlyArray<PickedCEGraph>;
    };
  };
};

type QueryModuleKey =
  | "averageRating"
  | "averageShippingDelay"
  | "averageShippingTime"
  | "refundRate"
  | "averageFulfillmentTime"
  | "all";

class Store {
  readonly storeName = "performance-customer-experience-graph";

  @observable
  averageFulfillmentTime: {
    data: ReadonlyArray<{
      readonly averageFulfillmentTime: Timedelta["days"];
      readonly recommendedAverageFulfillmentTime: number;
      readonly date: Datetime["mmddyyyy"];
    }>;
    startDate: Date;
    endDate: Date;
  } = {
    data: [],
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  @observable
  refundRate: {
    data: ReadonlyArray<{
      readonly refundRate30d: Timedelta["days"];
      readonly recommendedRefundRate: number;
      readonly date: Datetime["mmddyyyy"];
    }>;
    startDate: Date;
    endDate: Date;
  } = {
    data: [],
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  @observable
  averageShippingTime: {
    data: ReadonlyArray<{
      readonly averageShippingTime: Timedelta["days"];
      readonly recommendedAverageShippingTime: number;
      readonly date: Datetime["mmddyyyy"];
    }>;
    startDate: Date;
    endDate: Date;
  } = {
    data: [],
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  @observable
  averageShippingDelay: {
    data: ReadonlyArray<{
      readonly averageShippingDelay: Timedelta["days"];
      readonly recommendedAverageShippingDelay: number;
      readonly date: Datetime["mmddyyyy"];
    }>;
    startDate: Date;
    endDate: Date;
  } = {
    data: [],
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  @observable
  averageRating: {
    data: ReadonlyArray<{
      readonly averageRating30d: Timedelta["days"];
      readonly recommendedAverageRating: number;
      readonly date: Datetime["mmddyyyy"];
    }>;
    startDate: Date;
    endDate: Date;
  } = {
    data: [],
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  @observable
  currencyCode: PaymentCurrencyCode = "USD";

  queryModule: QueryModuleKey = "all";

  @action updateQueryModule(module: Exclude<QueryModuleKey, "all">) {
    this.queryModule = module;
  }

  @action updateDate(
    key: Exclude<QueryModuleKey, "all">,
    from: Date,
    to: Date,
  ) {
    this[key].startDate = from;
    this[key].endDate = to;
  }

  @action
  updateAverageFulfillmentData(data: CEGraphResponseData) {
    this.averageFulfillmentTime.data =
      data.currentMerchant.storeStats.daily.map((daily) => {
        const { averageFulfillmentTime, startDate } = daily;
        return {
          date: startDate.mmddyyyy,
          recommendedAverageFulfillmentTime: 1,
          averageFulfillmentTime: averageFulfillmentTime
            ? Number(round(String(averageFulfillmentTime.days), 3))
            : 0,
        };
      });
  }

  @action
  updateRefundRateData(data: CEGraphResponseData) {
    this.refundRate.data = data.currentMerchant.storeStats.daily.map(
      (daily) => {
        const { refundRate30d, startDate } = daily;
        return {
          date: startDate.mmddyyyy,
          recommendedRefundRate: 0.05,
          refundRate30d: refundRate30d
            ? Number(round(String(refundRate30d), 3))
            : 0,
        };
      },
    );
  }

  @action
  updateAverageShippingTimeData(data: CEGraphResponseData) {
    this.averageShippingTime.data = data.currentMerchant.storeStats.daily.map(
      (daily) => {
        const { averageShippingTime, startDate } = daily;
        return {
          date: startDate.mmddyyyy,
          recommendedAverageShippingTime: 14,
          averageShippingTime: averageShippingTime
            ? Number(round(String(averageShippingTime.days), 3))
            : 0,
        };
      },
    );
  }

  @action
  updateAverageShippingDelayData(data: CEGraphResponseData) {
    this.averageShippingDelay.data = data.currentMerchant.storeStats.daily.map(
      (daily) => {
        const { averageShippingDelay, startDate } = daily;
        return {
          date: startDate.mmddyyyy,
          recommendedAverageShippingDelay: 1,
          averageShippingDelay: averageShippingDelay
            ? Number(round(String(averageShippingDelay.days), 3))
            : 0,
        };
      },
    );
  }

  @action
  updateAverageRatingData(data: CEGraphResponseData) {
    this.averageRating.data = data.currentMerchant.storeStats.daily.map(
      (daily) => {
        const { averageRating30d, startDate } = daily;
        return {
          date: startDate.mmddyyyy,
          recommendedAverageRating: 4,
          averageRating30d: averageRating30d
            ? Number(round(String(averageRating30d), 3))
            : 0,
        };
      },
    );
  }

  @action
  updateGraphsData(data: CEGraphResponseData) {
    this.updateAverageFulfillmentData(data);
    this.updateRefundRateData(data);
    this.updateAverageShippingTimeData(data);
    this.updateAverageShippingDelayData(data);
    this.updateAverageRatingData(data);
  }
}

export default new Store();
