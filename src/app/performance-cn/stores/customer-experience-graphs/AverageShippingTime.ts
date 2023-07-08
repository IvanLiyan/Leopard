import { observable, action } from "mobx";
import { gql } from "@gql";
import { MerchantStatsDailyArgs, Datetime, Timedelta } from "@schema";
import { round } from "@core/toolkit/stringUtils";

const defaultStartDate = new Date(Date.now() - 30 * 24 * 3600 * 1000);
const defaultEndDate = new Date();

export const PERFORMANCE_CEG_DATA_QUERY = gql(`
  query CEG_AverageShippingTime_DataQuery($days: Int!, $offsetDays: Int!) {
    currentMerchant {
      storeStats {
        daily(days: $days, offsetDays: $offsetDays) {
          startDate {
            mmddyyyy
          }
          endDate {
            mmddyyyy
          }
          averageShippingTime {
            days
          }
        }
      }
    }
  }
`);

export type PickedCEGraph = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly averageShippingTime?: Pick<Timedelta, "days">;
};

export type CEGraphArgs = Pick<MerchantStatsDailyArgs, "days" | "offsetDays">;

export type CEGraphResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly daily: ReadonlyArray<PickedCEGraph>;
    };
  };
};

class Store {
  readonly storeName = "performance-CEG-averageShippingTime";

  lastUpdateDataDate: Datetime["mmddyyyy"] | null = null;

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

  @action
  updateAverageShippingTimeData(data: CEGraphResponseData) {
    const newData = data.currentMerchant.storeStats.daily.map((daily) => {
      const { averageShippingTime, startDate } = daily;
      return {
        date: startDate.mmddyyyy,
        recommendedAverageShippingTime: 14,
        averageShippingTime: averageShippingTime
          ? Number(round(String(averageShippingTime.days), 3))
          : 0,
      };
    });
    if (!this.lastUpdateDataDate) {
      this.lastUpdateDataDate = newData[newData.length - 1].date;
    }
    this.averageShippingTime = {
      startDate: new Date(newData[0].date),
      endDate: new Date(newData[newData.length - 1].date),
      data: newData,
    };
  }
}

export default new Store();
