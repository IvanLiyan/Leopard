import moment from "moment/moment";
import gql from "graphql-tag";
import numeral from "numeral";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

import {
  MerchantTrackingStats,
  MerchantRefundStats,
  MerchantRatingStats,
  MerchantCsStats,
  Datetime,
  Timedelta,
  CurrencyValue,
  MerchantTotalStats,
  MerchantSchema,
  ProductCatalogSchema,
  ProductSchema,
  ProductCatalogSchemaProductsArgs,
  ProductTotalStats,
  MerchantWishSellerStandardDetails,
  WishSellerStandardStats,
  WssMerchantLevelType,
  PolicySchema,
} from "@schema/types";

import {
  PRODUCT_COMPLIANCE_THRESHOLD,
  SHIPPING_LATE_CONFIRM_THRESHOLD,
  SHIPPING_VALID_TRACKING_THRESHOLD,
  CS_LATE_RESPONSE_THRESHOLD,
  CS_SATISFACTION_THRESHOLD,
  RATING_THRESHOLD,
} from "./constants";

/* Merchant Components */
import { IllustrationName } from "@merchant/component/core/Illustration";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

const TRIAL_END_DATE = "30/09/2022";

type PickedDatetime = Pick<Datetime, "formatted" | "iso8061"> & {
  readonly inTimezone: Pick<Datetime, "formatted">;
};

type PickedDatetimeWithFullDate = Pick<Datetime, "formatted"> & {
  readonly fullDateFormatted: Datetime["formatted"];
  readonly inTimezone: Pick<Datetime, "formatted"> & {
    readonly fullDateFormatted: Datetime["formatted"];
  };
};

type PickedMerchantTrackingStats = Pick<
  MerchantTrackingStats,
  "validTrackingRate" | "lateConfirmedFulfillmentRate"
> & {
  readonly startDate: PickedDatetime;
  readonly endDate: PickedDatetime;
  readonly averageFulfillmentTime?: Pick<Timedelta, "hours"> | null;
};

type PickedMerchantDeliveryStats = {
  readonly startDate: PickedDatetime;
  readonly endDate: PickedDatetime;
  readonly timeToDoor?: Pick<Timedelta, "days"> | null;
};

type PickedMerchantRefundStats = Pick<MerchantRefundStats, "refundRate"> & {
  readonly startDate: PickedDatetime;
  readonly endDate: PickedDatetime;
};

type PickedMerchantRatingStats = Pick<
  MerchantRatingStats,
  "averageProductRating"
> & {
  readonly startDate: PickedDatetime;
  readonly endDate: PickedDatetime;
};

type PickedMerchantCsStats = Pick<
  MerchantCsStats,
  "lateResponseRate30d" | "customerSatisfactionScore"
> & {
  readonly averageTicketResponseTime?: Pick<Timedelta, "hours"> | null;
  readonly startDate: PickedDatetime;
  readonly endDate: PickedDatetime;
};

export type PickedMerchantStats = {
  readonly updateTime?: Pick<Datetime, "formatted" | "timezone"> | null;
  readonly tracking?: PickedMerchantTrackingStats | null;
  readonly delivery?: PickedMerchantDeliveryStats | null;
  readonly refunds?: PickedMerchantRefundStats | null;
  readonly rating?: PickedMerchantRatingStats | null;
  readonly cs?: PickedMerchantCsStats | null;
};

export type PickedWishSellerStandardStats = Pick<
  WishSellerStandardStats,
  | "userRating"
  | "orderFultillmentRate"
  | "validTrackingRate"
  | "productQualityRefundRate"
  | "productLogisticsRefundRate"
  | "prohibitedProductCount"
  | "misleadingTrackingCount"
  | "misleadingListingCount"
  | "ipViolationProductCount"
  | "repeatIpInfractionCount"
  | "materialListingChangeCount"
  | "orderCancellationCount"
  | "unfulfilledOrderCount"
  | "lateConfirmedFulfillmentCount"
  | "maturedOrderCount"
  | "ninetyDayOrderCount"
> & {
  readonly fulfillmentSpeed: Pick<
    Timedelta,
    "days" | "hours" | "minutes" | "seconds"
  >;
  readonly date: Pick<Datetime, "unix">;
};

type PickedMerchantWssetails = Pick<
  MerchantWishSellerStandardDetails,
  "level"
> & {
  readonly stats?: PickedWishSellerStandardStats | null;
  readonly monthlyUpdateStats?: PickedWishSellerStandardStats | null;
  readonly lastUpdatedStats?: Pick<Datetime, "mmddyyyy"> | null;
};

export type PerformanceHealthInitialData = {
  readonly policy: {
    readonly misleadingProducts: PolicySchema["merchantWarningCount"];
    readonly ipInfringementProducts: PolicySchema["merchantWarningCount"];
    readonly prohibitedProducts: PolicySchema["merchantWarningCount"];
  };
  readonly currentMerchant: Pick<MerchantSchema, "id" | "state"> & {
    readonly storeStats: PickedMerchantStats | null;
  };
};

export type PerformanceMetricsStoreSalesResponseData = {
  readonly currentMerchant: {
    readonly storeStats?: {
      readonly totals: Pick<
        MerchantTotalStats,
        "impressions" | "pageViews" | "addToCarts" | "orders"
      > & {
        readonly gmv: Pick<
          CurrencyValue,
          "amount" | "display" | "currencyCode"
        >;
      };
      readonly daily: ReadonlyArray<
        Pick<
          MerchantTotalStats,
          "impressions" | "pageViews" | "addToCarts" | "orders"
        > & {
          readonly startDate: PickedDatetimeWithFullDate;
          readonly gmv: Pick<
            CurrencyValue,
            "amount" | "display" | "currencyCode"
          >;
        }
      >;
    } | null;
  };
};

export type PerformanceMetricsProductsResponseData = {
  readonly currentMerchant?: Pick<MerchantSchema, "state"> | null;
  readonly productCatalog?:
    | (Pick<ProductCatalogSchema, "productCount"> & {
        readonly products: ReadonlyArray<
          Pick<ProductSchema, "sku" | "name" | "id"> & {
            readonly variations: {
              readonly price: Pick<CurrencyValue, "amount" | "display">;
            };
            readonly stats: {
              readonly totals: Pick<
                ProductTotalStats,
                "orders" | "impressions"
              > & {
                readonly gmv: Pick<CurrencyValue, "amount" | "display">;
              };
            };
          }
        >;
      })
    | null;
};

export type PerformanceMetricsProductStatsDailyResponseData = {
  readonly productCatalog?: {
    readonly product?: {
      readonly stats: {
        readonly daily: ReadonlyArray<
          Pick<ProductTotalStats, "orders" | "impressions"> & {
            readonly startDate: PickedDatetimeWithFullDate;
          }
        >;
      };
    } | null;
  } | null;
};

export type PerformanceMetricsStoreSalesRequestData = {
  readonly days: number;
};

export type PerformanceMetricsProductsRequestData =
  ProductCatalogSchemaProductsArgs & {
    readonly days: number;
  };

export type PerformanceMetricsProductStatsDailyRequestData = {
  readonly days: number;
  readonly id: string;
};

export type MerchantScoreResponseData = {
  readonly currentMerchant: {
    readonly wishSellerStandard: PickedMerchantWssetails;
  };
};

export const countStoreHealthWarnings = (
  initialData: PerformanceHealthInitialData
) => {
  const {
    policy,
    currentMerchant: { storeStats },
  } = initialData;

  let count = 0;

  if (policy != null) {
    if (
      policy.ipInfringementProducts != null &&
      policy.ipInfringementProducts > PRODUCT_COMPLIANCE_THRESHOLD
    ) {
      count++;
    }
    if (
      policy.prohibitedProducts != null &&
      policy.prohibitedProducts > PRODUCT_COMPLIANCE_THRESHOLD
    ) {
      count++;
    }
    if (
      policy.misleadingProducts != null &&
      policy.misleadingProducts > PRODUCT_COMPLIANCE_THRESHOLD
    ) {
      count++;
    }
  }

  if (storeStats != null) {
    if (
      storeStats.tracking?.lateConfirmedFulfillmentRate != null &&
      storeStats.tracking.lateConfirmedFulfillmentRate >
        SHIPPING_LATE_CONFIRM_THRESHOLD
    ) {
      count++;
    }
    if (
      storeStats.tracking?.validTrackingRate != null &&
      storeStats.tracking.validTrackingRate < SHIPPING_VALID_TRACKING_THRESHOLD
    ) {
      count++;
    }
    if (
      storeStats.cs?.lateResponseRate30d != null &&
      storeStats.cs.lateResponseRate30d > CS_LATE_RESPONSE_THRESHOLD
    ) {
      count++;
    }
    if (
      storeStats.cs?.customerSatisfactionScore != null &&
      storeStats.cs.customerSatisfactionScore < CS_SATISFACTION_THRESHOLD
    ) {
      count++;
    }
    if (
      storeStats.rating?.averageProductRating != null &&
      storeStats.rating.averageProductRating < RATING_THRESHOLD
    ) {
      count++;
    }
  }

  return count;
};

export const useTierThemes: () => {
  [key in WssMerchantLevelType]: {
    readonly title: string;
    readonly icon: IllustrationName;
    readonly background?: string;
    readonly border?: string;
  };
} = () => {
  const {
    quaternaryDarker,
    quaternaryLightest,
    textDark,
    surfaceLight,
    warningDark,
    warningLighter,
    secondaryDarker,
    secondaryLighter,
  } = useTheme();

  return {
    BRONZE: {
      title: i`Bronze`,
      icon: "wssBronzeBadge",
      background: quaternaryLightest,
      border: quaternaryDarker,
    },
    SILVER: {
      title: i`Silver`,
      icon: "wssSilverBadge",
      background: surfaceLight,
      border: textDark,
    },
    GOLD: {
      title: i`Gold`,
      icon: "wssGoldBadge",
      background: warningLighter,
      border: warningDark,
    },
    PLATINUM: {
      title: i`Platinum`,
      icon: "wssPlatinumBadge",
      background: secondaryLighter,
      border: secondaryDarker,
    },
    BAN: {
      title: isAtRisk("BAN") ? i`At risk` : i`Deactivated`,
      icon: "warningFilled",
    },
    UNASSESSED: {
      title: i`Unrated`,
      icon: "wssUnratedBadge",
    },
  };
};

const USER_RATING: ReadonlyArray<number> = [3.5, 4, 4.3, 4.5, 5.0];
const ORDER_FULFILLMENT_RATE: ReadonlyArray<number> = [
  0.97, 0.98, 0.995, 0.998, 1,
];
const LOGISTICS_REFUND_RATE: ReadonlyArray<number> = [0.1, 0.08, 0.04, 0.02, 0];
const QUALITY_REFUND_RATE: ReadonlyArray<number> = [0.05, 0.02, 0.01, 0.005, 0];
const VALID_TRACKING_RATE: ReadonlyArray<number> = [0.95, 0.97, 0.99, 0.995, 1];
const FULFILLMENT_SPEED_RATE: ReadonlyArray<number> = [5, 2, 1.5, 1.0, 1.0];

const getLevel = (
  rating: number,
  thresholds: ReadonlyArray<number>
): WssMerchantLevelType => {
  if (rating < thresholds[0]) {
    return "BAN";
  } else if (rating >= thresholds[0] && rating < thresholds[1]) {
    return "BRONZE";
  } else if (rating >= thresholds[1] && rating < thresholds[2]) {
    return "SILVER";
  } else if (rating >= thresholds[2] && rating < thresholds[3]) {
    return "GOLD";
  } else if (rating >= thresholds[3]) {
    return "PLATINUM";
  }
  return "UNASSESSED";
};

const getLevelDesc = (
  rating: number,
  thresholds: ReadonlyArray<number>
): WssMerchantLevelType => {
  if (rating > thresholds[0]) {
    return "BAN";
  } else if (rating <= thresholds[0] && rating > thresholds[1]) {
    return "BRONZE";
  } else if (rating <= thresholds[1] && rating > thresholds[2]) {
    return "SILVER";
  } else if (rating <= thresholds[2] && rating > thresholds[3]) {
    return "GOLD";
  } else if (rating <= thresholds[3]) {
    return "PLATINUM";
  }
  return "UNASSESSED";
};

type GetGoalArgs = {
  readonly currentScore: number | null;
  readonly thresholds: ReadonlyArray<number>;
  readonly desc?: boolean | null;
};

const getGoal = (
  args: GetGoalArgs
): {
  goalLevel: WssMerchantLevelType | null;
  goalScore: number;
} => {
  const { currentScore, thresholds, desc } = args;

  const levels: ReadonlyArray<WssMerchantLevelType> = [
    "BAN",
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
  ];
  let currentLevel: WssMerchantLevelType = "UNASSESSED";

  if (desc && currentScore != null) {
    currentLevel = getLevelDesc(currentScore, thresholds);
  } else if (currentScore) {
    currentLevel = getLevel(currentScore, thresholds);
  }

  const index = levels.indexOf(currentLevel);
  if (
    currentScore != null &&
    desc &&
    currentScore <= thresholds[thresholds.length - 1]
  ) {
    return {
      // Current score is the best score, no more goal
      goalLevel: null,
      goalScore: currentScore,
    };
  } else if (
    currentScore != null &&
    !desc &&
    currentScore >= thresholds[thresholds.length - 1]
  ) {
    return {
      // Current score is the best score, no more goal
      goalLevel: null,
      goalScore: currentScore,
    };
  } else if (index + 1 >= levels.length) {
    return {
      goalLevel: levels[levels.length - 1],
      goalScore: thresholds[levels.length - 1],
    };
  } else if (currentLevel === "UNASSESSED") {
    return {
      goalLevel: "PLATINUM",
      goalScore: thresholds[levels.length - 1],
    };
  }

  return {
    goalLevel: levels[index + 1],
    goalScore: thresholds[index],
  };
};

export type ScoreData = {
  readonly currentLevel: WssMerchantLevelType;
  readonly currentScoreDisplay: string;
  readonly goalLevel: WssMerchantLevelType | null;
  readonly goalScoreDisplay: string;
};

type GetScoreDataArgs = {
  readonly currentScore: number | null;
  readonly thresholds: ReadonlyArray<number>;
  readonly displayFormat: string;
  readonly desc: boolean;
};

const getScoreData = (args: GetScoreDataArgs): ScoreData => {
  const { currentScore, thresholds, displayFormat, desc } = args;

  let currentLevel: WssMerchantLevelType = "UNASSESSED";
  if (desc && currentScore != null) {
    currentLevel = getLevelDesc(currentScore, thresholds);
  } else if (currentScore != null) {
    currentLevel = getLevel(currentScore, thresholds);
  }
  const currentScoreDisplay =
    currentScore != null ? numeral(currentScore).format(displayFormat) : "-";
  const { goalLevel, goalScore } = getGoal({
    currentScore,
    thresholds,
    desc,
  });
  const goalScoreDisplay = numeral(goalScore).format(displayFormat);

  return {
    currentLevel,
    currentScoreDisplay,
    goalLevel,
    goalScoreDisplay,
  };
};

export const getAverageUserRatingData = (score: number | null): ScoreData => {
  const currentScore = score ? Math.round(score * 10) / 10 : null;
  return getScoreData({
    currentScore,
    thresholds: USER_RATING,
    displayFormat: "0.0",
    desc: false,
  });
};

export const getOrderFulfillmentRateData = (
  score: number | null
): ScoreData => {
  const currentScore = score ? Math.round(score * 1000) / 1000 : null;
  return getScoreData({
    currentScore,
    thresholds: ORDER_FULFILLMENT_RATE,
    displayFormat: "0.[0]%",
    desc: false,
  });
};

export const getValidTrackingRateData = (score: number | null): ScoreData => {
  const currentScore = score ? Math.round(score * 1000) / 1000 : null;
  return getScoreData({
    currentScore,
    thresholds: VALID_TRACKING_RATE,
    displayFormat: "0.[0]%",
    desc: false,
  });
};

export const getLogisticsRefundData = (score: number | null): ScoreData => {
  const currentScore = score ? Math.round(score * 1000) / 1000 : null;
  return getScoreData({
    currentScore,
    thresholds: LOGISTICS_REFUND_RATE,
    displayFormat: "0.[0]%",
    desc: true,
  });
};

export const getQualityRefundData = (score: number | null): ScoreData => {
  const currentScore = score ? Math.round(score * 1000) / 1000 : null;
  return getScoreData({
    currentScore,
    thresholds: QUALITY_REFUND_RATE,
    displayFormat: "0.[0]%",
    desc: true,
  });
};

export const getFulfillmentSpeedData = (
  score: PickedWishSellerStandardStats["fulfillmentSpeed"] | null
): ScoreData => {
  const currentScore = score ? Math.round(score.days * 10) / 10 : null;

  const currentLevel =
    currentScore != null
      ? getLevelDesc(currentScore, FULFILLMENT_SPEED_RATE)
      : "UNASSESSED";
  const currentScoreDisplay =
    currentScore != null ? renderFulfillmentSpeedText(currentScore) : "-";
  const { goalLevel, goalScore } = getGoal({
    currentScore,
    thresholds: FULFILLMENT_SPEED_RATE,
    desc: true,
  });
  const goalScoreDisplay = ni18n(
    goalScore,
    "1 day",
    "{%1=number of days} days"
  );

  return {
    currentLevel,
    currentScoreDisplay,
    goalLevel,
    goalScoreDisplay,
  };
};

export const getMatureOrdersData = (currentScore: number | null): ScoreData => {
  let currentLevel: WssMerchantLevelType = "UNASSESSED";
  let goalLevel: WssMerchantLevelType | null = "PLATINUM";
  if (currentScore != null && currentScore >= 100) {
    currentLevel = "PLATINUM";
    goalLevel = null;
  }

  const currentScoreDisplay =
    currentScore != null ? currentScore.toString() : "-";
  const goalScoreDisplay = `100`;

  return {
    currentLevel,
    currentScoreDisplay,
    goalLevel,
    goalScoreDisplay,
  };
};

export const metricsDataMap = {
  userRating: getAverageUserRatingData,
  orderFultillmentRate: getOrderFulfillmentRateData,
  validTrackingRate: getValidTrackingRateData,
  productQualityRefundRate: getQualityRefundData,
  productLogisticsRefundRate: getLogisticsRefundData,
  fulfillmentSpeed: getFulfillmentSpeedData,
} as const;

const riskEndDate = moment(TRIAL_END_DATE, "DD/MM/YYYY");

export const isAtRisk = (level: WssMerchantLevelType) =>
  level === "BAN" && moment().isBefore(riskEndDate);

const renderFulfillmentSpeedText = (days: number) => {
  if (days < 1) {
    return i`< 1 day`;
  }

  return ni18n(days, "1 day", "{%1=number of days} days");
};

export const MERCHANT_SCORE_QUERY = gql`
  query MerchantScore_MerchantScoreSection {
    currentMerchant {
      wishSellerStandard {
        level
        stats {
          userRating
          orderFultillmentRate
          validTrackingRate
          productQualityRefundRate
          productLogisticsRefundRate
          fulfillmentSpeed {
            days
            hours
            minutes
            seconds
          }
          misleadingTrackingCount
          prohibitedProductCount
          misleadingListingCount
          ipViolationProductCount
          repeatIpInfractionCount
          materialListingChangeCount
          orderCancellationCount
          unfulfilledOrderCount
          lateConfirmedFulfillmentCount
          maturedOrderCount
          ninetyDayOrderCount
          date {
            unix
          }
        }
        lastUpdatedStats {
          mmddyyyy
        }
        monthlyUpdateStats {
          userRating
          orderFultillmentRate
          validTrackingRate
          productQualityRefundRate
          productLogisticsRefundRate
          fulfillmentSpeed {
            days
            hours
            minutes
            seconds
          }
          misleadingTrackingCount
          prohibitedProductCount
          misleadingListingCount
          ipViolationProductCount
          repeatIpInfractionCount
          materialListingChangeCount
          orderCancellationCount
          unfulfilledOrderCount
          lateConfirmedFulfillmentCount
          maturedOrderCount
          ninetyDayOrderCount
          date {
            unix
          }
        }
      }
    }
  }
`;
