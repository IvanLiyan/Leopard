import { observable, action } from "mobx";
import { gql } from "@apollo/client";
import {
  MerchantStatsDailyArgs,
  Datetime,
  Timedelta,
  MerchantTotalStats,
} from "@schema";
import { round } from "@core/toolkit/stringUtils";

const defaultStartDate = new Date(Date.now() - 30 * 24 * 3600 * 1000);
const defaultEndDate = new Date();

export const PERFORMANCE_CEG_DATA_QUERY = gql`
  query CEG_AverageRating_DataQuery($days: Int!, $offsetDays: Int!) {
    currentMerchant {
      storeStats {
        daily(days: $days, offsetDays: $offsetDays) {
          startDate {
            mmddyyyy
          }
          endDate {
            mmddyyyy
          }
          averageRating30d
        }
      }
    }
  }
`;

export type PickedCEGraph = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
} & Pick<MerchantTotalStats, "averageRating30d">;

export type CEGraphArgs = Pick<MerchantStatsDailyArgs, "days" | "offsetDays">;

export type CEGraphResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly daily: ReadonlyArray<PickedCEGraph>;
    };
  };
};

class Store {
  readonly storeName = "performance-CEG-averageRating";

  lastUpdateDataDate: Datetime["mmddyyyy"] | null = null;

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

  @action
  updateAverageRatingData(data: CEGraphResponseData) {
    const newData = data.currentMerchant.storeStats.daily.map((daily) => {
      const { averageRating30d, startDate } = daily;
      return {
        date: startDate.mmddyyyy,
        recommendedAverageRating: 4,
        averageRating30d: averageRating30d
          ? Number(round(String(averageRating30d), 3))
          : 0,
      };
    });
    if (!this.lastUpdateDataDate) {
      this.lastUpdateDataDate = newData[newData.length - 1].date;
    }
    this.averageRating = {
      startDate: new Date(newData[0].date),
      endDate: new Date(newData[newData.length - 1].date),
      data: newData,
    };
  }
}

export default new Store();
