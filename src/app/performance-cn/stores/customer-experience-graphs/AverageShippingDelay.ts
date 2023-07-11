import { observable, action } from "mobx";
import { gql } from "@gql";
import { MerchantStatsDailyArgs, Datetime, Timedelta } from "@schema";
import { round } from "@core/toolkit/stringUtils";

const defaultStartDate = new Date(Date.now() - 30 * 24 * 3600 * 1000);
const defaultEndDate = new Date();

export const PERFORMANCE_CEG_DATA_QUERY = gql(`
  query CEG_AverageShippingDelay_DataQuery($days: Int!, $offsetDays: Int!) {
    currentMerchant {
      storeStats {
        daily(days: $days, offsetDays: $offsetDays) {
          startDate {
            mmddyyyy
          }
          endDate {
            mmddyyyy
          }
          averageShippingDelay {
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
  readonly averageShippingDelay?: Pick<Timedelta, "days">;
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
  readonly storeName = "performance-CEG-averageShippingDelay";

  lastUpdateDataDate: Datetime["mmddyyyy"] | null = null;

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

  @action
  updateAverageShippingDelayData(data: CEGraphResponseData) {
    const newData = data.currentMerchant.storeStats.daily.map((daily) => {
      const { averageShippingDelay, startDate } = daily;
      return {
        date: startDate.mmddyyyy,
        recommendedAverageShippingDelay: 1,
        averageShippingDelay: averageShippingDelay
          ? Number(round(String(averageShippingDelay.days), 3))
          : 0,
      };
    });
    if (!this.lastUpdateDataDate) {
      this.lastUpdateDataDate = newData[newData.length - 1].date;
    }
    this.averageShippingDelay = {
      startDate: new Date(newData[0].date),
      endDate: new Date(newData[newData.length - 1].date),
      data: newData,
    };
  }
}

export default new Store();
