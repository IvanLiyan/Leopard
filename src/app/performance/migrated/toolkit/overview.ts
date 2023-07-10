import { ci18n } from "@core/toolkit/i18n";
import {
  Datetime,
  WssMetricTrend,
  WssMetricType,
  WssThingsToWatch,
} from "@schema";
import { metricsDataMap, PickedMerchantWssDetails } from "./stats";
import { gql } from "@apollo/client";

export const WSSThingsToWatchQuery = gql`
  query MerchantScore_ThingsToWatch {
    currentMerchant {
      wishSellerStandard {
        thingsToWatchBoard {
          dataSlice {
            metricType
            metricTrend
            metricValue
            recordTime {
              unix
            }
          }
        }
      }
    }
  }
`;
export type WSSThingsToWatchQueryResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard?: {
      readonly thingsToWatchBoard?: {
        readonly dataSlice?: ReadonlyArray<
          Pick<
            WssThingsToWatch,
            "metricTrend" | "metricType" | "metricValue"
          > & {
            readonly recordTime?: Pick<Datetime, "unix">;
          }
        >;
      };
    };
  };
};

export const WSSMetricTypeMapping: {
  [P in WssMetricType]: {
    readonly name: string;
    readonly type: string;
    readonly href: string;
  };
} = {
  AVERAGE_USER_RATING: {
    name: ci18n("Name of a WSS performance metric", "Average user rating"),
    type: ci18n(
      "A category of metrics used to compute WSS tier",
      "Performance metrics",
    ),
    href: "/wish-standards/user-rating",
  },
  LOGISTICS_REFUND: {
    name: ci18n("Name of a WSS performance metric", "Logistics refund"),
    type: ci18n(
      "A category of metrics used to compute WSS tier",
      "Performance metrics",
    ),
    href: "/wish-standards/logistics-refund",
  },
  ORDER_FULFILLMENT_RATE: {
    name: ci18n("Name of a WSS performance metric", "Order fulfillment rate"),
    type: ci18n(
      "A category of metrics used to compute WSS tier",
      "Performance metrics",
    ),
    href: "/wish-standards/fulfillment-rate",
  },
  ORDER_FULFILLMENT_SPEED: {
    name: ci18n(
      "Name of a WSS performance metric",
      "Confirmed fulfillment speed",
    ),
    type: ci18n(
      "A category of metrics used to compute WSS tier",
      "Performance metrics",
    ),
    href: "/wish-standards/fulfillment-speed",
  },
  PRODUCT_QUALITY_REFUND: {
    name: ci18n("Name of a WSS performance metric", "Product quality refund"),
    type: ci18n(
      "A category of metrics used to compute WSS tier",
      "Performance metrics",
    ),
    href: "/wish-standards/quality-refund",
  },
  VALID_TRACKING_RATE: {
    name: ci18n("Name of a WSS performance metric", "Valid tracking rate"),
    type: ci18n(
      "A category of metrics used to compute WSS tier",
      "Performance metrics",
    ),
    href: "/wish-standards/valid-tracking",
  },
  LATE_CONFIRMED_FULFILLMENT: {
    name: ci18n(
      "Name of a WSS fulfillment infraction",
      "Late confirmed fulfillment",
    ),
    type: ci18n(
      "WSS infractions from fulfillment-related reasons",
      "Fulfillment infractions",
    ),
    href: "/warnings/v2/fulfillment-infractions",
  },
  UNFULFILLED_ORDER: {
    name: ci18n("Name of a WSS fulfillment infraction", "Unfulfilled order"),
    type: ci18n(
      "WSS infractions from fulfillment-related reasons",
      "Fulfillment infractions",
    ),
    href: "/warnings/v2/fulfillment-infractions",
  },
  ORDER_CANCELLATION: {
    name: ci18n("Name of a WSS fulfillment infraction", "Order cancellation"),
    type: ci18n(
      "WSS infractions from fulfillment-related reasons",
      "Fulfillment infractions",
    ),
    href: "/warnings/v2/fulfillment-infractions",
  },
  MISLEADING_TRACKING: {
    name: ci18n("Name of a WSS fulfillment infraction", "Misleading tracking"),
    type: ci18n(
      "WSS infractions from fulfillment-related reasons",
      "Fulfillment infractions",
    ),
    href: "/warnings/v2/fulfillment-infractions",
  },
  MISLEADING_LISTING: {
    name: ci18n(
      "Name of a WSS product-related infraction",
      "Misleading listings",
    ),
    type: ci18n(
      "WSS infractions from product-related reasons",
      "Product related infractions",
    ),
    href: "/warnings/v2/product-infractions",
  },
  PROHIBITED_PRODUCT: {
    name: ci18n(
      "Name of a WSS product-related infraction",
      "Prohibited products",
    ),
    type: ci18n(
      "WSS infractions from product-related reasons",
      "Product related infractions",
    ),
    href: "/warnings/v2/product-infractions",
  },
};

export const WssMetricTrendNumber: { [P in WssMetricTrend]: number } = {
  DECREASING: -1,
  INCREASING: 1,
  SAME: 0,
  UNSPECIFIED: 0,
} as const;

// -1: smaller number is better
// 1: larger number is better
export const WSSMetricTypeSign: { [P in WssMetricType]: 1 | -1 } = {
  AVERAGE_USER_RATING: 1,
  VALID_TRACKING_RATE: 1,
  ORDER_FULFILLMENT_RATE: 1,
  LOGISTICS_REFUND: -1,
  PRODUCT_QUALITY_REFUND: -1,
  LATE_CONFIRMED_FULFILLMENT: -1,
  MISLEADING_LISTING: -1,
  MISLEADING_TRACKING: -1,
  ORDER_CANCELLATION: -1,
  ORDER_FULFILLMENT_SPEED: -1,
  PROHIBITED_PRODUCT: -1,
  UNFULFILLED_ORDER: -1,
};

export const WSSMetricTypeScoreDataMap = {
  AVERAGE_USER_RATING: metricsDataMap.userRating,
  LOGISTICS_REFUND: metricsDataMap.productLogisticsRefundRate,
  ORDER_FULFILLMENT_RATE: metricsDataMap.orderFultillmentRate,
  ORDER_FULFILLMENT_SPEED: metricsDataMap.fulfillmentSpeed,
  PRODUCT_QUALITY_REFUND: metricsDataMap.productQualityRefundRate,
  VALID_TRACKING_RATE: metricsDataMap.validTrackingRate,
} as const;

export type WssNoOpportunityReason =
  | "PERFECT_SCORE"
  | "INSUFFICIENT_ORDERS"
  | "NO_METRICS";

export const useNoOpportunityMessage = (
  wssDetails?: PickedMerchantWssDetails | null,
): string | null => {
  const level = wssDetails?.level;
  const stats = wssDetails?.stats;
  const metricKeys = Object.keys(metricsDataMap) as Array<
    keyof typeof metricsDataMap
  >;
  const reasons: {
    [P in WssNoOpportunityReason]: {
      readonly show: boolean;
      readonly text: string;
    };
  } = {
    PERFECT_SCORE: {
      show:
        (level === "GOLD" || level === "PLATINUM") &&
        metricKeys.some(
          (metric) => metricsDataMap[metric](stats).currentLevel != null,
        ),
      text:
        i`**Congrats on your performance!**${"\n\n"}` +
        i`We have no tips for improving your tier rating for now.`,
    },
    INSUFFICIENT_ORDERS: {
      show:
        level != null &&
        level != "GOLD" &&
        level != "PLATINUM" &&
        metricKeys.some(
          (metric) => metricsDataMap[metric](stats).currentLevel != null,
        ),
      text:
        i`**Congrats on your performance!**${"\n\n"}` +
        i`We have no tips for now. Your tier should reflect your ` +
        i`current performance once you get more orders.`,
    },
    NO_METRICS: {
      show: metricKeys.every(
        (metric) => metricsDataMap[metric](stats).currentLevel == null,
      ),
      text: i`Once you get orders, you'll find performance areas that need improvement here.`,
    },
  };

  if (reasons.NO_METRICS.show) {
    return reasons.NO_METRICS.text;
  }
  if (reasons.PERFECT_SCORE.show) {
    return reasons.PERFECT_SCORE.text;
  }
  if (reasons.INSUFFICIENT_ORDERS.show) {
    return reasons.INSUFFICIENT_ORDERS.text;
  }
  return null;
};
