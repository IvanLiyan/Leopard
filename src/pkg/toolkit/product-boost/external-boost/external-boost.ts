import { gql } from "@apollo/client/core";
import { useTheme } from "@merchant/stores/ThemeStore";
import {
  CurrencyInput,
  CurrencyValue,
  Datetime,
  ExternalBoostAttributedStats,
  ExternalBoostChargingMethod,
  MarketingServiceSchemaMerchantPropertyArgs,
  MarketingStatsOffsiteBoostArgs,
  OffsiteBoost,
  OffsiteBoostDailyStats,
  OffsiteBoostPropertyInput,
  UpdateOffsiteBoost,
} from "@schema/types";

export type DailyStatsDateRange = {
  readonly from: Date;
  readonly to: Date;
};

export const DailyStatsLineTypes = [
  "CLICKS",
  "ORDERS",
  "GMV",
  "SPEND",
  "ATTRIBUTED_GMV",
  "ATTRIBUTED_ORDERS",
] as const;
export type DailyStatsLineType = typeof DailyStatsLineTypes[number];

export const ChargingMethodDailyStats: {
  [chargingMethod in ExternalBoostChargingMethod]: ReadonlyArray<DailyStatsLineType>;
} = {
  CPA: ["ORDERS", "GMV", "SPEND", "ATTRIBUTED_GMV", "ATTRIBUTED_ORDERS"],
  CPC: ["CLICKS", "ORDERS", "GMV", "SPEND"],
};

export const DailyStatsDataKeys: { [line in DailyStatsLineType]: string } = {
  CLICKS: "clicks",
  ORDERS: "orders",
  GMV: "gmv.amount",
  SPEND: "spend.amount",
  ATTRIBUTED_GMV: "attributed.gmv.amount",
  ATTRIBUTED_ORDERS: "attributed.orders",
};

export const useDailyStatsLineStroke = (): {
  [line in DailyStatsLineType]: string;
} => {
  const {
    metricCyan,
    metricOrange,
    metricPurple,
    metricBlue,
    metricRed,
    metricYellow,
  } = useTheme();
  return {
    CLICKS: metricCyan,
    ORDERS: metricOrange,
    GMV: metricPurple,
    SPEND: metricBlue,
    ATTRIBUTED_GMV: metricRed,
    ATTRIBUTED_ORDERS: metricYellow,
  };
};

export const DailyStatsNames: { [line in DailyStatsLineType]: string } = {
  CLICKS: i`Clicks`,
  ORDERS: i`Orders`,
  GMV: i`GMV`,
  SPEND: i`Spend`,
  ATTRIBUTED_GMV: i`Attributed GMV`,
  ATTRIBUTED_ORDERS: i`Attributed Orders`,
};

export const useDailyStatsTooltips = (
  chargingMethod: ExternalBoostChargingMethod,
): {
  [line in DailyStatsLineType]: string;
} => {
  return {
    CLICKS:
      i`Total number of clicks that your products ` +
      i`receive from external platforms per day`,
    ORDERS: i`Total number of orders your products receive per day`,
    GMV:
      i`Gross merchandising value (i.e., total value of goods sold, ` +
      i`including product and shipping prices) per day`,
    SPEND:
      chargingMethod === "CPA"
        ? i`Total cost of click-based orders received per day from external platforms`
        : i`Total cost of clicks received per day from external platforms`,
    ATTRIBUTED_GMV: i`Gross merchandising value per day attributed to ExternalBoost`,
    ATTRIBUTED_ORDERS: i`Total number of orders received per day attributed to ExternalBoost`,
  };
};

export type ExternalBoostInitialData = {
  readonly marketing: {
    readonly currentMerchant: {
      readonly offsiteBoost: Pick<OffsiteBoost, "chargingMethod"> & {
        readonly maxDailyBudget: Pick<CurrencyValue, "amount" | "display">;
        readonly minDailyBudget: Pick<CurrencyValue, "amount" | "display">;
        readonly statsAvailableDate: Pick<Datetime, "unix">;
      };
    };
  };
};

// Get social ads boost stats for chart

export const GET_EXTERNAL_BOOST_STATS = gql`
  query SocialAdsBoost_GetSocialAdsBoostStats(
    $startDate: DatetimeInput!
    $endDate: DatetimeInput!
  ) {
    currentMerchant {
      storeStats {
        marketing {
          offsiteBoost(startDate: $startDate, endDate: $endDate) {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            daily {
              clicks
              orders
              attributed {
                orders
                gmv {
                  amount
                  currencyCode
                  display
                }
              }
              gmv {
                amount
                currencyCode
                display
              }
              spend {
                amount
                currencyCode
                display
              }
              date {
                formatted(fmt: "%b %d")
              }
            }
          }
        }
      }
    }
  }
`;

export type PickedExternalBoostDailyStatsType = Pick<
  OffsiteBoostDailyStats,
  "clicks" | "orders"
> & {
  readonly attributed?: Pick<ExternalBoostAttributedStats, "orders"> & {
    readonly gmv: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
  };
  readonly gmv: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
  readonly spend: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
  readonly date: Pick<Datetime, "formatted">;
};

export type GetExternalBoostStatsResponseType = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly marketing: {
        readonly offsiteBoost: {
          readonly startDate: Pick<Datetime, "mmddyyyy">;
          readonly endDate: Pick<Datetime, "mmddyyyy">;
          readonly daily: ReadonlyArray<PickedExternalBoostDailyStatsType>;
        };
      };
    };
  };
};

export type GetExternalBoostStatsInputType = MarketingStatsOffsiteBoostArgs;

// Get social ads boost isEnabled and daily budget

export const GET_EXTERNAL_BOOST_DAILY_BUDGET = gql`
  query SocialAdsBoost_GetSocialAdsBoostDailyBudget {
    marketing {
      currentMerchant {
        offsiteBoost {
          enabled
          dailyBudget {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
export type GetExternalBoostDailyBudgetResponseType = {
  readonly marketing: {
    readonly currentMerchant: {
      readonly offsiteBoost: Pick<OffsiteBoost, "enabled"> & {
        readonly dailyBudget: Pick<CurrencyValue, "amount" | "currencyCode">;
      };
    };
  };
};

export type GetExternalBoostDailyBudgetInputType =
  MarketingServiceSchemaMerchantPropertyArgs;

// Mutate social ads boost isEnabled

export const SET_EXTERNAL_BOOST_TOGGLE = gql`
  mutation SocialAdsBoost_SetSocialAdsBoostToggle(
    $input: OffsiteBoostPropertyInput!
  ) {
    marketing {
      updateOffsiteBoost(input: $input) {
        ok
        message
      }
    }
  }
`;

export type SetExternalBoostToggleResponseType = {
  readonly marketing: {
    readonly updateOffsiteBoost: Pick<UpdateOffsiteBoost, "ok" | "message">;
  };
};

export type SetExternalBoostToggleInputType = {
  readonly input: Pick<OffsiteBoostPropertyInput, "enabled">;
};

// Mutate social ads boost daily budget

export const SET_EXTERNAL_BOOST_DAILY_BUDGET = gql`
  mutation SocialAdsBoost_SetSocialAdsBoostDailyBudget(
    $input: OffsiteBoostPropertyInput!
  ) {
    marketing {
      updateOffsiteBoost(input: $input) {
        ok
        message
      }
    }
  }
`;

export type SetExternalBoostDailyBudgetResponseType = {
  readonly marketing: {
    readonly updateOffsiteBoost: Pick<UpdateOffsiteBoost, "ok" | "message">;
  };
};

export type SetExternalBoostDailyBudgetInputType = {
  readonly input: {
    readonly dailyBudget?: Pick<CurrencyInput, "amount" | "currencyCode">;
  };
};
