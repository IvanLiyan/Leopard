import { observable, action } from "mobx";
import { gql } from "@gql";
import {
  MerchantStatsDailyArgs,
  Datetime,
  Timedelta,
  MerchantTotalStats,
} from "@schema";
import { round } from "@core/toolkit/stringUtils";

const defaultStartDate = new Date(Date.now() - 30 * 24 * 3600 * 1000);
const defaultEndDate = new Date();

export const PERFORMANCE_CEG_DATA_QUERY = gql(`
  query CEG_RefundRate_DataQuery($days: Int!, $offsetDays: Int!) {
    currentMerchant {
      storeStats {
        daily(days: $days, offsetDays: $offsetDays) {
          startDate {
            mmddyyyy
          }
          endDate {
            mmddyyyy
          }
          refundRate30d
        }
      }
    }
  }
`);

export type PickedCEGraph = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
} & Pick<MerchantTotalStats, "refundRate30d">;

export type CEGraphArgs = Pick<MerchantStatsDailyArgs, "days" | "offsetDays">;

export type CEGraphResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly daily: ReadonlyArray<PickedCEGraph>;
    };
  };
};

class Store {
  readonly storeName = "performance-CEG-refundRate";

  lastUpdateDataDate: Datetime["mmddyyyy"] | null = null;

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

  @action
  updateRefundRateData(data: CEGraphResponseData) {
    const newData = data.currentMerchant.storeStats.daily.map((daily) => {
      const { refundRate30d, startDate } = daily;
      return {
        date: startDate.mmddyyyy,
        recommendedRefundRate: 0.05,
        refundRate30d: refundRate30d
          ? Number(round(String(refundRate30d), 3))
          : 0,
      };
    });
    if (!this.lastUpdateDataDate) {
      this.lastUpdateDataDate = newData[newData.length - 1].date;
    }
    this.refundRate = {
      startDate: new Date(newData[0].date),
      endDate: new Date(newData[newData.length - 1].date),
      data: newData,
    };
  }
}

export default new Store();
