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

type PickedDatetime = Pick<Datetime, "formatted"> & {
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

export type PerformanceHealthInitialData = {
  readonly policy: {
    readonly misleadingProducts: PolicySchema["merchantWarningCount"];
    readonly ipInfringementProducts: PolicySchema["merchantWarningCount"];
    readonly prohibitedProducts: PolicySchema["merchantWarningCount"];
  };
  readonly currentMerchant: Pick<MerchantSchema, "priceDropEnabled"> & {
    readonly id: MerchantSchema["id"];
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

export type PerformanceMetricsProductsRequestData = ProductCatalogSchemaProductsArgs & {
  readonly days: number;
};

export type PerformanceMetricsProductStatsDailyRequestData = {
  readonly days: number;
  readonly id: string;
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
