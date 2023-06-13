import { gql } from "@apollo/client";
import numeral from "numeral";

/* Legacy */
import { cni18n } from "@core/toolkit/i18n";

import {
  TrackingPerformanceStats,
  RefundPerformanceStats,
  RatingPerformanceStats,
  CsPerformanceStats,
  Datetime,
  Timedelta,
  CurrencyValue,
  CommerceMerchantState,
  MerchantTotalStats,
  MerchantSchema,
  ProductCatalogSchema,
  ProductSchema,
  ProductCatalogSchemaProductsV2Args,
  ProductTotalStats,
  MerchantWishSellerStandardDetails,
  WishSellerStandardStats,
  WssMerchantLevelType,
  PolicySchema,
} from "@schema";

import {
  PRODUCT_COMPLIANCE_THRESHOLD,
  SHIPPING_LATE_CONFIRM_THRESHOLD,
  SHIPPING_VALID_TRACKING_THRESHOLD,
  CS_LATE_RESPONSE_THRESHOLD,
  CS_SATISFACTION_THRESHOLD,
  RATING_THRESHOLD,
} from "./constants";

/* Merchant Components */
import { IllustrationName } from "@core/components/Illustration";

/* Merchant Stores */
import { useTheme } from "@core/stores/ThemeStore";
import round from "lodash/round";

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
  TrackingPerformanceStats,
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

type PickedMerchantRefundStats = Pick<RefundPerformanceStats, "refundRate"> & {
  readonly startDate: PickedDatetime;
  readonly endDate: PickedDatetime;
};

type PickedMerchantRatingStats = Pick<
  RatingPerformanceStats,
  "averageProductRating"
> & {
  readonly startDate: PickedDatetime;
  readonly endDate: PickedDatetime;
};

export type PickedMerchantCsStats = Pick<
  CsPerformanceStats,
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
  | "maturedOrderCount"
  | "ninetyDayOrderCount"
  | "badProductRate"
> & {
  readonly fulfillmentSpeed?: Pick<
    Timedelta,
    "days" | "hours" | "minutes" | "seconds"
  > | null;
  readonly date: Pick<Datetime, "unix">;
};

type PickedWishSellerStandardComplianceStats = Pick<
  WishSellerStandardStats,
  | "misleadingTrackingCount"
  | "prohibitedProductCount"
  | "misleadingListingCount"
  | "orderCancellationCount"
  | "unfulfilledOrderCount"
  | "lateConfirmedFulfillmentCount"
> & {
  readonly date: Pick<Datetime, "unix">;
};

export type PickedMerchantWssDetails = Pick<
  MerchantWishSellerStandardDetails,
  "level" | "prevLevel" | "rawLevel" | "layer1Level" | "isInactiveToBan"
> & {
  readonly stats?: PickedWishSellerStandardStats | null;
  readonly monthlyUpdateStats?: PickedWishSellerStandardStats | null;
  readonly complianceUpdateStats?: PickedWishSellerStandardComplianceStats | null;
  readonly lastUpdatedStats?: Pick<Datetime, "mmddyyyy"> | null;
  readonly lastTierUpdateDate?: Pick<Datetime, "unix"> | null;
  readonly nextMonthlyTierUpdateDate?: Pick<Datetime, "unix"> | null;
  readonly endDateForLastMonthlyUpdateCalcWindow?: Pick<
    Datetime,
    "unix"
  > | null;
  readonly policyInfractionWindowStartDate?: Pick<Datetime, "unix"> | null;
  readonly policyInfractionWindowEndDate?: Pick<Datetime, "unix"> | null;
  readonly fulfillmentInfractionWindowStartDate?: Pick<Datetime, "unix"> | null;
  readonly fulfillmentInfractionWindowEndDate?: Pick<Datetime, "unix"> | null;
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
    | (Pick<ProductCatalogSchema, "productCountV2"> & {
        readonly productsV2: ReadonlyArray<
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
  ProductCatalogSchemaProductsV2Args & {
    readonly days: number;
  };

export type PerformanceMetricsProductStatsDailyRequestData = {
  readonly days: number;
  readonly id: string;
};

export type MerchantScoreResponseData = {
  readonly currentMerchant: Pick<MerchantSchema, "id"> & {
    readonly wishSellerStandard: PickedMerchantWssDetails;
  };
};

export const countStoreHealthWarnings = (
  initialData: PerformanceHealthInitialData,
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

export const WSS_MISSING_SCORE_INDICATOR = "-";

type TierThemeMap = {
  readonly [T in WssMerchantLevelType]: {
    readonly title: string;
    readonly icon: IllustrationName;
    readonly background?: string;
    readonly border?: string;
    readonly scale: string;
  };
};

export const useTierThemes: () => (tier: WssMerchantLevelType | null) => {
  readonly title: string;
  readonly icon: IllustrationName;
  readonly background?: string;
  readonly border?: string;
  readonly scale: string;
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
    negativeDarker,
    textLight,
    warning,
  } = useTheme();

  const tierThemeMap: TierThemeMap = {
    BRONZE: {
      title: i`Bronze`,
      icon: "wssBronzeBadge",
      background: quaternaryLightest,
      border: quaternaryDarker,
      scale: quaternaryDarker,
    },
    SILVER: {
      title: i`Silver`,
      icon: "wssSilverBadge",
      background: surfaceLight,
      border: textDark,
      scale: textLight,
    },
    GOLD: {
      title: i`Gold`,
      icon: "wssGoldBadge",
      background: warningLighter,
      border: warningDark,
      scale: warning,
    },
    PLATINUM: {
      title: i`Platinum`,
      icon: "wssPlatinumBadge",
      background: secondaryLighter,
      border: secondaryDarker,
      scale: secondaryDarker,
    },
    BAN: {
      title: isAtRisk("BAN") ? i`At risk` : i`Deactivated`,
      icon: "wssBannedBadge",
      scale: negativeDarker,
    },
    UNASSESSED: {
      title: i`Unrated`,
      icon: "wssUnratedBadge",
      scale: negativeDarker,
    },
  };

  return (tier: WssMerchantLevelType | null) =>
    tierThemeMap[tier ?? "UNASSESSED"];
};

type TierThemeV2Map = {
  readonly title: string;
  readonly icon: IllustrationName;
  readonly background?: string;
  readonly border?: string;
};

export const useTierThemesV2: () => (tier: WssMerchantLevelType | null) => {
  readonly title: string;
  readonly icon: IllustrationName;
  readonly background?: string;
  readonly border?: string;
} = () => {
  const { quaternary, surface, surfaceDark, warning, warningDark, secondary } =
    useTheme();

  const tierThemeMap: { readonly [T in WssMerchantLevelType]: TierThemeV2Map } =
    {
      BRONZE: {
        title: i`Bronze`,
        icon: "wssBronzeBadge",
        border: quaternary,
      },
      SILVER: {
        title: i`Silver`,
        icon: "wssSilverBadge",
        border: surfaceDark,
      },
      GOLD: {
        title: i`Gold`,
        icon: "wssGoldBadge",
        border: warningDark,
      },
      PLATINUM: {
        title: i`Platinum`,
        icon: "wssPlatinumBadge",
        border: secondary,
      },
      BAN: {
        title: isAtRisk("BAN") ? i`At risk` : i`Deactivated`,
        icon: "wssBannedBadge",
        border: warning,
      },
      UNASSESSED: {
        title: i`Unrated`,
        icon: "wssUnratedBadge",
        border: surface,
      },
    };

  return (tier: WssMerchantLevelType | null) =>
    tierThemeMap[tier ?? "UNASSESSED"];
};

/**
 * Parse displayed score to number for comparison.
 * We use displayed score instead of original score for comparison
 * because we want to know if score has changed in the displayed format.
 * For example, if original score is 1.51 and it changes to 1.52, the displayed
 * score (one decimal places) would be 1.5 for both.
 * If we campare original scores then it would say that the score has increased,
 * which is not what we want here.
 * @example gt("1.5", "1.4") => 1.5 - 1.4 => 0.1
 * @example lt("99.8%", "99.9%") => 99.9 - 99.8 => 0.1
 */
const gt = (a: string, b: string) => numeral(a).value() - numeral(b).value();
const lt = (a: string, b: string) => numeral(b).value() - numeral(a).value();

export const statsComparator: {
  [key: string]: (a: string, b: string) => number;
} = {
  userRating: gt,
  orderFultillmentRate: gt,
  validTrackingRate: gt,
  productQualityRefundRate: lt,
  productLogisticsRefundRate: lt,
  fulfillmentSpeed: lt,
};

export const USER_RATING = [3.5, 4, 4.3, 4.5, 5.0] as const;
export const ORDER_FULFILLMENT_RATE = [0.97, 0.98, 0.995, 0.998, 1] as const;
export const LOGISTICS_REFUND_RATE = [0.1, 0.08, 0.04, 0.02, 0] as const;
export const QUALITY_REFUND_RATE = [0.05, 0.02, 0.01, 0.005, 0] as const;
export const VALID_TRACKING_RATE = [0.95, 0.97, 0.99, 0.995, 1] as const;
export const FULFILLMENT_SPEED_RATE = [5, 2, 1.5, 1.0, 1.0] as const;
// Below are new ranges; will enable behind dkey once we confirm whether they are
// active during the transition or post transition state TODO [lliepert]
// export const USER_RATING = [3.5, 4, 4.3, 4.5, 5.0] as const;
// export const ORDER_FULFILLMENT_RATE = [0.97, 0.985, 0.995, 0.998, 1] as const;
// export const QUALITY_REFUND_RATE = [0.05, 0.02, 0.01, 0.005, 0] as const;
// export const LOGISTICS_REFUND_RATE = [0.04, 0.02, 0.015, 0.01, 0] as const;
// export const VALID_TRACKING_RATE = [0.95, 0.97, 0.99, 0.995, 1] as const;
// export const FULFILLMENT_SPEED_RATE = [3, 2, 1.5, 1.0, 1.0] as const;
export const UNDERPERFORMING_PRODUCT_RATE = [
  0.09, 0.05, 0.03, 0.015, 0,
] as const;

const USER_RATING_IMPERFECT_BEST = 4.9;
const ORDER_FULFILLMENT_RATE_IMPERFECT_BEST = 0.999;
const LOGISTICS_REFUND_RATE_IMPERFECT_BEST = 0.001;
const QUALITY_REFUND_RATE_IMPERFECT_BEST = 0.001;
const VALID_TRACKING_RATE_IMPERFECT_BEST = 0.999;
const FULFILLMENT_SPEED_RATE_IMPERFECT_BEST = 1.1;
const FULFILLMENT_SPEED_RATE_PERFECT_WORST = 0.9;

const getLevel = (
  rating: number,
  thresholds: ReadonlyArray<number>,
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
  thresholds: ReadonlyArray<number>,
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
  args: GetGoalArgs,
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
      goalScore: thresholds[thresholds.length - 1],
    };
  } else if (
    currentScore != null &&
    !desc &&
    currentScore >= thresholds[thresholds.length - 1]
  ) {
    return {
      // Current score is the best score, no more goal
      goalLevel: null,
      goalScore: thresholds[thresholds.length - 1],
    };
  } else if (index + 1 >= levels.length) {
    return {
      goalLevel: levels[levels.length - 1],
      goalScore: thresholds[levels.length - 1],
    };
  } else if (currentLevel === "UNASSESSED") {
    return {
      goalLevel: "PLATINUM",
      goalScore: thresholds[levels.length - 2],
    };
  }

  return {
    goalLevel: levels[index + 1],
    goalScore: thresholds[index],
  };
};

export type ScoreData = {
  readonly currentLevel: WssMerchantLevelType | null;
  readonly currentScoreDisplay: string | null;
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

  let currentLevel: WssMerchantLevelType | null = null;
  if (desc && currentScore != null) {
    currentLevel = getLevelDesc(currentScore, thresholds);
  } else if (currentScore != null) {
    currentLevel = getLevel(currentScore, thresholds);
  }
  const currentScoreDisplay =
    currentScore == null ? null : numeral(currentScore).format(displayFormat);
  const { goalLevel, goalScore } = getGoal({
    currentScore,
    thresholds,
    desc,
  });

  // If goal score is 1, show 100% instead of 100.0%
  const goalScoreDisplay =
    goalScore === 1 && displayFormat === "0.0%"
      ? "100%"
      : numeral(goalScore).format(displayFormat);

  return {
    currentLevel,
    currentScoreDisplay,
    goalLevel,
    goalScoreDisplay,
  };
};

const getAverageUserRatingData = (
  stats: Pick<PickedWishSellerStandardStats, "userRating"> | null | undefined,
): ScoreData => {
  const format = "0.0";
  if (stats?.userRating == null) {
    return getScoreData({
      currentScore: null,
      thresholds: USER_RATING,
      displayFormat: format,
      desc: false,
    });
  }

  const currentScore =
    stats.userRating == USER_RATING[USER_RATING.length - 1]
      ? stats.userRating
      : Math.min(round(stats.userRating, 1), USER_RATING_IMPERFECT_BEST);

  return getScoreData({
    currentScore,
    thresholds: USER_RATING,
    displayFormat: format,
    desc: false,
  });
};

const getOrderFulfillmentRateData = (
  stats:
    | Pick<PickedWishSellerStandardStats, "orderFultillmentRate">
    | null
    | undefined,
): ScoreData => {
  const format = "0.0%";
  if (stats?.orderFultillmentRate == null) {
    return getScoreData({
      currentScore: null,
      thresholds: ORDER_FULFILLMENT_RATE,
      displayFormat: format,
      desc: false,
    });
  }

  const currentScore =
    stats.orderFultillmentRate ==
    ORDER_FULFILLMENT_RATE[ORDER_FULFILLMENT_RATE.length - 1]
      ? stats.orderFultillmentRate
      : Math.min(
          round(stats.orderFultillmentRate, 3),
          ORDER_FULFILLMENT_RATE_IMPERFECT_BEST,
        );

  return getScoreData({
    currentScore,
    thresholds: ORDER_FULFILLMENT_RATE,
    displayFormat: format,
    desc: false,
  });
};

const getValidTrackingRateData = (
  stats:
    | Pick<PickedWishSellerStandardStats, "validTrackingRate">
    | null
    | undefined,
): ScoreData => {
  if (stats?.validTrackingRate == null) {
    return getScoreData({
      currentScore: null,
      thresholds: VALID_TRACKING_RATE,
      displayFormat: "0.0%",
      desc: false,
    });
  }

  const currentScore =
    stats.validTrackingRate ==
    VALID_TRACKING_RATE[VALID_TRACKING_RATE.length - 1]
      ? stats.validTrackingRate
      : Math.min(
          round(stats.validTrackingRate, 3),
          VALID_TRACKING_RATE_IMPERFECT_BEST,
        );
  return getScoreData({
    currentScore,
    thresholds: VALID_TRACKING_RATE,
    displayFormat: "0.0%",
    desc: false,
  });
};

const getLogisticsRefundData = (
  stats:
    | Pick<PickedWishSellerStandardStats, "productLogisticsRefundRate">
    | null
    | undefined,
): ScoreData => {
  const format = "0.0%";
  if (stats?.productLogisticsRefundRate == null) {
    return getScoreData({
      currentScore: null,
      thresholds: LOGISTICS_REFUND_RATE,
      displayFormat: format,
      desc: true,
    });
  }
  const currentScore =
    stats.productLogisticsRefundRate ==
    LOGISTICS_REFUND_RATE[LOGISTICS_REFUND_RATE.length - 1]
      ? stats.productLogisticsRefundRate
      : Math.max(
          round(stats.productLogisticsRefundRate, 3),
          LOGISTICS_REFUND_RATE_IMPERFECT_BEST,
        );
  return getScoreData({
    currentScore,
    thresholds: LOGISTICS_REFUND_RATE,
    displayFormat: format,
    desc: true,
  });
};

const getQualityRefundData = (
  stats:
    | Pick<PickedWishSellerStandardStats, "productQualityRefundRate">
    | null
    | undefined,
): ScoreData => {
  if (stats?.productQualityRefundRate == null) {
    return getScoreData({
      currentScore: null,
      thresholds: QUALITY_REFUND_RATE,
      displayFormat: "0.0%",
      desc: true,
    });
  }

  const currentScore =
    stats.productQualityRefundRate ==
    QUALITY_REFUND_RATE[QUALITY_REFUND_RATE.length - 1]
      ? stats.productQualityRefundRate
      : Math.max(
          round(stats.productQualityRefundRate, 3),
          QUALITY_REFUND_RATE_IMPERFECT_BEST,
        );

  return getScoreData({
    currentScore,
    thresholds: QUALITY_REFUND_RATE,
    displayFormat: "0.0%",
    desc: true,
  });
};

const getFulfillmentSpeedData = (
  stats:
    | {
        readonly fulfillmentSpeed?: Pick<Timedelta, "days"> | null;
      }
    | null
    | undefined,
): ScoreData => {
  const getCurrentScore = () => {
    if (stats?.fulfillmentSpeed == null) {
      return null;
    }
    const perfectScore =
      FULFILLMENT_SPEED_RATE[FULFILLMENT_SPEED_RATE.length - 1];
    if (stats.fulfillmentSpeed.days == perfectScore) {
      return stats.fulfillmentSpeed.days;
    }
    if (stats.fulfillmentSpeed.days < perfectScore) {
      return Math.min(
        round(stats.fulfillmentSpeed.days, 1),
        FULFILLMENT_SPEED_RATE_PERFECT_WORST,
      );
    }
    return Math.max(
      round(stats.fulfillmentSpeed.days, 1),
      FULFILLMENT_SPEED_RATE_IMPERFECT_BEST,
    );
  };
  const currentScore = getCurrentScore();

  const currentLevel =
    currentScore != null
      ? getLevelDesc(currentScore, FULFILLMENT_SPEED_RATE)
      : null;
  const currentScoreDisplay =
    currentScore != null
      ? cni18n(
          "Short for 1 day",
          currentScore,
          "1d",
          "{%2=number of days}d",
          numeral(currentScore).format("0.0"),
        )
      : null;
  const { goalLevel, goalScore } = getGoal({
    currentScore,
    thresholds: FULFILLMENT_SPEED_RATE,
    desc: true,
  });
  const goalScoreDisplay = cni18n(
    "Short for 1 day",
    goalScore,
    "1d",
    "{%2=number of days}d",
    numeral(goalScore).format("0.0"),
  );

  return {
    currentLevel,
    currentScoreDisplay,
    goalLevel,
    goalScoreDisplay,
  };
};

const getUnderperformingProducts = (
  stats:
    | Pick<PickedWishSellerStandardStats, "badProductRate">
    | null
    | undefined,
): ScoreData => {
  if (stats?.badProductRate == null) {
    return getScoreData({
      currentScore: null,
      thresholds: UNDERPERFORMING_PRODUCT_RATE,
      displayFormat: "0.0%",
      desc: true,
    });
  }

  const currentScore =
    stats.badProductRate ==
    UNDERPERFORMING_PRODUCT_RATE[UNDERPERFORMING_PRODUCT_RATE.length - 1]
      ? stats.badProductRate
      : Math.max(
          round(stats.badProductRate, 3),
          QUALITY_REFUND_RATE_IMPERFECT_BEST,
        );

  return getScoreData({
    currentScore,
    thresholds: UNDERPERFORMING_PRODUCT_RATE,
    displayFormat: "0.0%",
    desc: true,
  });
};

// Will NOT round to perfect metric value
export const metricsDataMap = {
  userRating: getAverageUserRatingData,
  orderFultillmentRate: getOrderFulfillmentRateData,
  validTrackingRate: getValidTrackingRateData,
  productQualityRefundRate: getQualityRefundData,
  productLogisticsRefundRate: getLogisticsRefundData,
  fulfillmentSpeed: getFulfillmentSpeedData,
  underperformingProducts: getUnderperformingProducts,
} as const;

const countMetrics = (
  stats: PickedWishSellerStandardStats | undefined | null,
  pred: (i: ScoreData) => boolean,
): number => {
  return (
    Object.keys(metricsDataMap) as Array<keyof typeof metricsDataMap>
  ).filter((a) => {
    return pred(metricsDataMap[a](stats));
  }).length;
};

export const isAtRisk = (level: WssMerchantLevelType | null | undefined) =>
  level === "BAN";

export const isBanned = (state: CommerceMerchantState | null | undefined) =>
  state === "DISABLED";

export const countInfractionsImpactTier = (
  stats: PickedWishSellerStandardComplianceStats | null | undefined,
) => {
  return (
    (stats?.misleadingListingCount || 0) +
    (stats?.prohibitedProductCount || 0) +
    (stats?.misleadingTrackingCount || 0)
  );
};

export type WssBannerTriggerType =
  | "INSUFFICIENT_MATURE_ORDER"
  | "NO_LONGER_PLATINUM"
  | "DID_NOT_UPGRADE_TO_PLATINUM"
  | "BRONZE_FROM_INFRACTIONS"
  | "UNVALIDATED_UNRATED_NO_DATA"
  | "VALIDATED_UNRATED_NO_DATA"
  | "UNVALIDATED_UNRATED_WITH_DATA"
  | "AIV_ADJUSTMENT"
  | "ACCOUNT_DISABLED"
  | "ACCOUNT_AT_RISK"
  | "BAN_FROM_INACTIVITY";

export const useWssBannerTriggers = (props: {
  readonly merchantState: CommerceMerchantState;
  readonly wssDetails?: PickedMerchantWssDetails | null;
}): {
  readonly [k in WssBannerTriggerType]: {
    readonly show: boolean;
  };
} => {
  const { merchantState: state, wssDetails } = props;
  const prevLevel = wssDetails?.prevLevel;
  const level = wssDetails?.level;
  const rawLevel = wssDetails?.rawLevel;
  const layer1Level = wssDetails?.layer1Level;
  const monthlyUpdateStats = wssDetails?.monthlyUpdateStats;
  const stats = wssDetails?.stats;
  const infractionStats = wssDetails?.complianceUpdateStats;

  const isUnrated = level === "UNASSESSED" || level == null;
  const isPending =
    state === "PENDING" ||
    state === "PENDING_PHONE" ||
    state === "PENDING_EMAIL";

  return {
    BAN_FROM_INACTIVITY: {
      show: isAtRisk(level) && !!wssDetails?.isInactiveToBan,
    },
    ACCOUNT_DISABLED: {
      show: isBanned(state),
    },
    ACCOUNT_AT_RISK: {
      show: isAtRisk(level),
    },
    INSUFFICIENT_MATURE_ORDER: {
      show:
        !isBanned(state) &&
        prevLevel === level &&
        monthlyUpdateStats != null &&
        stats != null &&
        monthlyUpdateStats.ninetyDayOrderCount < 50 &&
        stats.ninetyDayOrderCount < 50,
    },
    NO_LONGER_PLATINUM: {
      show:
        !isBanned(state) &&
        stats != null &&
        stats.maturedOrderCount < 100 &&
        monthlyUpdateStats != null &&
        monthlyUpdateStats.maturedOrderCount < 100 &&
        prevLevel === "PLATINUM" &&
        level !== "PLATINUM",
    },
    DID_NOT_UPGRADE_TO_PLATINUM: {
      show:
        !isBanned(state) &&
        stats != null &&
        stats.maturedOrderCount < 100 &&
        monthlyUpdateStats != null &&
        monthlyUpdateStats.maturedOrderCount < 100 &&
        countInfractionsImpactTier(infractionStats) == 0 &&
        countMetrics(stats, (score) => score.currentLevel === "PLATINUM") ===
          Object.keys(metricsDataMap).length,
    },
    BRONZE_FROM_INFRACTIONS: {
      show:
        !isBanned(state) &&
        level === "BRONZE" &&
        wssMerchantLevelGt(layer1Level, level),
    },
    UNVALIDATED_UNRATED_NO_DATA: {
      show:
        !isBanned(state) &&
        isUnrated &&
        isPending &&
        stats?.ninetyDayOrderCount == null &&
        stats?.maturedOrderCount == null,
    },
    VALIDATED_UNRATED_NO_DATA: {
      show:
        !isBanned(state) &&
        isUnrated &&
        !isPending &&
        stats?.ninetyDayOrderCount == null &&
        stats?.maturedOrderCount == null,
    },
    UNVALIDATED_UNRATED_WITH_DATA: {
      show:
        !isBanned(state) &&
        isUnrated &&
        isPending &&
        (stats?.ninetyDayOrderCount != null ||
          stats?.maturedOrderCount != null),
    },
    AIV_ADJUSTMENT: {
      show:
        rawLevel != layer1Level && wssMerchantLevelGt(layer1Level, rawLevel),
    },
  };
};

const wssMerchantLevelCode: { readonly [k in WssMerchantLevelType]: number } = {
  UNASSESSED: 1,
  BAN: 2,
  BRONZE: 3,
  SILVER: 4,
  GOLD: 5,
  PLATINUM: 6,
};

const wssMerchantLevelGt = (
  a: WssMerchantLevelType | null | undefined,
  b: WssMerchantLevelType | null | undefined,
): boolean => !!a && !!b && wssMerchantLevelCode[a] > wssMerchantLevelCode[b];

export const MERCHANT_SCORE_QUERY = gql`
  query MerchantScore_MerchantScoreSection {
    currentMerchant {
      id
      wishSellerStandard {
        prevLevel
        level
        rawLevel
        layer1Level
        isInactiveToBan
        lastTierUpdateDate {
          unix
        }
        nextMonthlyTierUpdateDate {
          unix
        }
        endDateForLastMonthlyUpdateCalcWindow {
          unix
        }
        policyInfractionWindowStartDate {
          unix
        }
        policyInfractionWindowEndDate {
          unix
        }
        fulfillmentInfractionWindowStartDate {
          unix
        }
        fulfillmentInfractionWindowEndDate {
          unix
        }
        stats {
          userRating
          orderFultillmentRate
          validTrackingRate
          productQualityRefundRate
          productLogisticsRefundRate
          badProductRate
          fulfillmentSpeed {
            days
            hours
            minutes
            seconds
          }
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
          badProductRate
          fulfillmentSpeed {
            days
            hours
            minutes
            seconds
          }
          maturedOrderCount
          ninetyDayOrderCount
          date {
            unix
          }
        }
        complianceUpdateStats {
          misleadingTrackingCount
          prohibitedProductCount
          misleadingListingCount
          orderCancellationCount
          unfulfilledOrderCount
          lateConfirmedFulfillmentCount
          date {
            unix
          }
        }
      }
    }
  }
`;
