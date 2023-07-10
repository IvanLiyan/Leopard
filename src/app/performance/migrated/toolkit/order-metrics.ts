import { SortOrder } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import {
  Datetime,
  MerchantWishSellerStandardDetailsRecentStatsArgs,
  SortByOrder,
  WishSellerStandardStats,
  WssLogisticsRefundReason,
  WssMerchantLevelType,
  WssOrderFulfillment,
  WssOrderFulfillmentPage,
  WssOrderRefund,
  WssOrderRefundPage,
  WssPerformanceDeepDiveHub,
  WssPerformanceDeepDiveHubOrderFulfillmentSpeedArgs,
  WssPerformanceDeepDiveHubOrderInvalidTrackingArgs,
  WssPerformanceDeepDiveHubOrderLogisticsRefundArgs,
  WssPerformanceDeepDiveHubOrderQualityRefundArgs,
  WssPerformanceDeepDiveHubOrderUnfulfilledArgs,
  WssPerformanceDeepDiveHubProductQualityRefundArgs,
  WssPerformanceDeepDiveHubProductRatingArgs,
  WssPerformanceDeepDiveHubQualityRefundBreakdownArgs,
  WssProductRating,
  WssProductRefund,
  WssQualityRefundReason,
  WsssUnfulfilledReasons,
  WssPerformanceDeepDiveHubDestinationsArgs,
  WssPerformanceDeepDiveHubCarriersArgs,
  WssPerformanceDeepDiveHubQualityRefundReasonsArgs,
  Locale,
} from "@schema";
import { gql } from "@apollo/client";
import {
  LOGISTICS_REFUND_RATE,
  ORDER_FULFILLMENT_RATE,
  QUALITY_REFUND_RATE,
  USER_RATING,
  VALID_TRACKING_RATE,
} from "./stats";

export const WssLookbackDayCount = 90;
export const RecentStatsDayCount = 30;

type PickedDate = {
  readonly date: Pick<Datetime, "unix">;
};

type PickedStats = Pick<
  WishSellerStandardStats,
  | "userRating"
  | "orderFultillmentRate"
  | "productQualityRefundRate"
  | "fulfillmentSpeed"
  | "validTrackingRate"
  | "productLogisticsRefundRate"
>;

export const WSSDeepDiveQuery = gql`
  query WSSOrdersDeepDive($days: Int) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          totalRatingsReceived
          fulfillmentRateDenominator
          refundRateDenominator
          hasFulfillmentSpeedOrderCount
          validTrackingRateDenominator
          qualityRefundCount
          orderUnfulfilled {
            totalCount
          }
          orderInvalidTracking {
            totalCount
          }
          orderLogisticsRefund {
            totalCount
          }
        }
        stats {
          userRating
          orderFultillmentRate
          productQualityRefundRate
          fulfillmentSpeed {
            seconds
            minutes
            hours
            days
          }
          validTrackingRate
          productLogisticsRefundRate
          date {
            unix
          }
        }
        monthlyUpdateStats {
          userRating
          orderFultillmentRate
          productQualityRefundRate
          fulfillmentSpeed {
            seconds
            minutes
            hours
            days
          }
          validTrackingRate
          productLogisticsRefundRate
        }
        recentStats(days: $days) {
          userRating
          orderFultillmentRate
          productQualityRefundRate
          fulfillmentSpeed {
            seconds
            minutes
            hours
            days
          }
          validTrackingRate
          productLogisticsRefundRate
          date {
            unix
          }
        }
      }
    }
  }
`;

export type WSSDeepDiveQueryRequest =
  MerchantWishSellerStandardDetailsRecentStatsArgs;
export type WSSDeepDiveQueryResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly stats?: PickedStats & PickedDate;
      readonly monthlyUpdateStats?: PickedStats;
      readonly recentStats?: ReadonlyArray<PickedStats & PickedDate>;
      readonly deepDive?: Pick<
        WssPerformanceDeepDiveHub,
        | "totalRatingsReceived"
        | "fulfillmentRateDenominator"
        | "refundRateDenominator"
        | "hasFulfillmentSpeedOrderCount"
        | "validTrackingRateDenominator"
        | "qualityRefundCount"
      > & {
        readonly orderUnfulfilled: Pick<WssOrderFulfillmentPage, "totalCount">;
        readonly orderInvalidTracking: Pick<
          WssOrderFulfillmentPage,
          "totalCount"
        >;
        readonly orderLogisticsRefund: Pick<WssOrderRefundPage, "totalCount">;
      };
    };
  };
};

export type TimelineDatapoint = {
  readonly millisecond: number;
  readonly value: number;
  readonly calculatedFrom?: string;
  readonly calculatedTo?: string;
};

export const LogisticsRefundReasonLabel: {
  readonly [r in WssLogisticsRefundReason]: string;
} = {
  SHIPPING_TAKING_TOO_LONG: ci18n("Refund reason", "Shipping taking too long"),
  ITEM_NEVER_ARRIVED: ci18n("Refund reason", "Item never arrived"),
  MERCHANT_SENT_TO_WRONG_ADDRESS: ci18n(
    "Refund reason",
    "Item delivered to wrong address",
  ),
  ITEM_RETURNED_TO_SENDER: ci18n(
    "Refund reason",
    "Item was returned to sender",
  ),
  NOT_QUALIFIED_SHIPPING_PROVIDER: ci18n(
    "Refund reason",
    "Sent with unqualified carrier",
  ),
  FBW_FAILED_TO_FULFILL_DUE_TO_CARRIER_RETURN: ci18n(
    "Refund reason",
    "FBW return",
  ),
  EPC_OVERWEIGHT: ci18n("Refund reason", "Wrong weight"),
  EPC_OVERSIZE: ci18n("Refund reason", "Wrong size"),
  EPC_LAST_MILE_CARRIERS_UNABLE_TO_SHIP: ci18n(
    "Refund reason",
    "Unable to ship",
  ),
  EPC_OVERVALUE: ci18n("Refund reason", "Item value"),
  ITEM_HELD_AT_CUSTOMS: ci18n("Refund reason", "Held at customs"),
  ITEM_MARKED_DELIVERED_BUT_DID_NOT_ARRIVE: ci18n(
    "Refund reason",
    "Item marked delivered; user did not receive it",
  ),
  USER_ENTERED_INVALID_ADDRESS: ci18n("Refund reason", "Invalid address"),
};

export const AllWssQualityRefundReasons: ReadonlyArray<WssQualityRefundReason> =
  [
    "OTHER",
    "ITEM_IS_COUNTERFEIT",
    "ITEM_DOES_NOT_FIT",
    "RECEIVED_WRONG_ITEM",
    "ITEM_IS_DAMAGED",
    "ITEM_DOES_NOT_WORK_AS_DESCRIBED",
    "ITEM_DOES_NOT_MATCH_LISTING",
    "MISLEADING_LISTING",
    "ITEM_IS_DANGEROUS",
    "WRONG_COLOR",
    "ITEM_IS_POOR_QUALITY",
    "PRODUCT_LISTING_MISSING_INFO",
    "ITEM_DID_NOT_MEET_EXPECTATIONS",
    "EMPTY_PACKAGE",
    "INCORRECT_QUANTITY_OF_ITEMS",
    "MISSING_ITEM_OR_PARTS",
    "STORE_SENT_THE_WRONG_SIZE",
    "PRODUCT_MALFUNCTION",
    "RECEIVED_NOTE_FROM_MERCHANT",
  ];

export const QualityRefundReasonLabel: {
  readonly [r in WssQualityRefundReason]: string;
} = {
  OTHER: ci18n("Refund reason", "Other"),
  ITEM_IS_COUNTERFEIT: ci18n("Refund reason", "Item is counterfeit"),
  MISLEADING_LISTING: ci18n("Refund reason", "Misleading listing"),
  PRODUCT_LISTING_MISSING_INFO: ci18n(
    "Refund reason",
    "Product listing is missing information",
  ),
  EMPTY_PACKAGE: ci18n("Refund reason", "Package was empty"),
  RECEIVED_NOTE_FROM_MERCHANT: ci18n(
    "Refund reason",
    "Received note from merchant",
  ),
  ITEM_DOES_NOT_FIT: ci18n("Refund reason", "Item does not fit"),
  RECEIVED_WRONG_ITEM: ci18n("Refund reason", "Received the wrong item"),
  ITEM_IS_DAMAGED: ci18n("Refund reason", "Damaged item"),
  ITEM_DOES_NOT_WORK_AS_DESCRIBED: ci18n(
    "Refund reason",
    "Item does not work as described",
  ),
  ITEM_DOES_NOT_MATCH_LISTING: ci18n(
    "Refund reason",
    "Item does not match listing",
  ),
  ITEM_IS_DANGEROUS: ci18n("Refund reason", "Dangerous item"),
  WRONG_COLOR: ci18n("Refund reason", "Wrong color"),
  ITEM_IS_POOR_QUALITY: ci18n("Refund reason", "Poor quality"),
  ITEM_DID_NOT_MEET_EXPECTATIONS: ci18n(
    "Refund reason",
    "Item did not meet expectations",
  ),
  INCORRECT_QUANTITY_OF_ITEMS: ci18n("Refund reason", "Incorrect quantity"),
  MISSING_ITEM_OR_PARTS: ci18n("Refund reason", "Missing parts"),
  STORE_SENT_THE_WRONG_SIZE: ci18n("Refund reason", "Wrong size"),
  PRODUCT_MALFUNCTION: ci18n("Refund reason", "Product malfunctioned"),
};

export const WssUnfulfilledReasonLabel: {
  readonly [r in WsssUnfulfilledReasons]: string;
} = {
  ORDER_CANCELLED: ci18n(
    "Reason the order was not fulfilled",
    "Order cancelled",
  ),
  ORDER_EXPIRED: ci18n("Reason the order was not fulfilled", "Order expired"),
  ORDER_REFUNDED: ci18n(
    "Reason the order was not fulfilled",
    "Refunded post-fulfillment",
  ),
  ORDER_TRACKING_CANCELLED: ci18n(
    "Reason the order was not fulfilled",
    "Order tracking cancelled",
  ),
};

// add an extra tick on the worst end to reserve space for "At Risk" text
export const UserRatingTicks = [3.3, ...USER_RATING] as const;
export const OrderFulfillmentRateTicks = [
  0.965,
  ...ORDER_FULFILLMENT_RATE,
] as const;
export const LogisticsRefundRateTicks = [
  0.12,
  ...LOGISTICS_REFUND_RATE,
] as const;
export const QualityRefundRateTicks = [0.055, ...QUALITY_REFUND_RATE] as const;
export const ValidTrackRatingTicks = [0.94, ...VALID_TRACKING_RATE] as const;
// special case because we set goal at platinum threshold (1 day) to 1 day as well
// replace this goal with 0 day to be visually accurate
export const FulfillmentSpeedRateTicks = [6, 5, 2, 1.5, 1.0, 0] as const;

export const MetricScaleDisplayedTiers: ReadonlyArray<WssMerchantLevelType> = [
  "BAN",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
];

export const nameOf = <T>(name: keyof T) => name;

export const formatDateWindow = (
  unixDate: number | null | undefined,
  locale: Locale,
): [string | undefined, string | undefined] => {
  const today = unixDate ? new Date(unixDate * 1000) : undefined;
  const formattedStartDate = today
    ? new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(today).setDate(today.getDate() - WssLookbackDayCount))
    : undefined;

  const formattedEndDate = today
    ? new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(today)
    : undefined;

  return [formattedStartDate, formattedEndDate];
};

export const WSSAverageUserRatingQuery = gql`
  query OrderMetricsDeepDive_UserRating(
    $offset: Int
    $limit: Int
    $sortField: SortProductRatingField
    $sortOrder: SortByOrder
    $productIds: [ObjectIdType!]
    $isBadByRating: Boolean
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          productRating(
            offset: $offset
            limit: $limit
            sortField: $sortField
            sortOrder: $sortOrder
            productIds: $productIds
            isBadByRating: $isBadByRating
          ) {
            totalCount
            dataSlice {
              productId
              productName
              productImageUrl
              receivedRatings
              averageRating
            }
          }
        }
      }
    }
  }
`;
export type WSSAverageUserRatingRequest =
  WssPerformanceDeepDiveHubProductRatingArgs;
export type WSSAverageUserRatingResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: {
        readonly productRating: {
          readonly totalCount: number;
          readonly dataSlice: ReadonlyArray<
            Pick<
              WssProductRating,
              | "productId"
              | "productName"
              | "productImageUrl"
              | "receivedRatings"
              | "averageRating"
            >
          >;
        };
      };
    };
  };
};

export const WSSOrderFulfillmentRateQuery = gql`
  query OrderMetricsDeepDive_OrderFulfillmentRate(
    $offset: Int
    $limit: Int
    $sortField: SortOrderTransactionDateField
    $sortOrder: SortByOrder
    $orderIds: [ObjectIdType!]
    $unfulfilledReasons: [WSSSUnfulfilledReasons!]
    $destinations: [String!]
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          orderUnfulfilled(
            offset: $offset
            limit: $limit
            sortField: $sortField
            sortOrder: $sortOrder
            orderIds: $orderIds
            unfulfilledReasons: $unfulfilledReasons
            destinations: $destinations
          ) {
            totalCount
            dataSlice {
              productId
              productName
              productImageUrl
              orderId
              transactionDate {
                unix
              }
              unfulfilledReason
              destination
            }
          }
        }
      }
    }
  }
`;
export type WSSOrderFulfillmentRateRequest =
  WssPerformanceDeepDiveHubOrderUnfulfilledArgs;
export type WSSOrderFulfillmentRateResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: {
        readonly orderUnfulfilled: {
          readonly totalCount: number;
          readonly dataSlice: ReadonlyArray<
            Pick<
              WssOrderFulfillment,
              | "productId"
              | "productName"
              | "productImageUrl"
              | "orderId"
              | "unfulfilledReason"
              | "destination"
            > & {
              readonly transactionDate: Pick<Datetime, "unix">;
            }
          >;
        };
      };
    };
  };
};

export const WSSDestinationOptionsQuery = gql`
  query OrderMetricsDeepDive_WSSDestinationOptions(
    $pageType: WSSDeepDivePageType!
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          destinations(pageType: $pageType)
        }
      }
    }
  }
`;
export type WSSDestinationOptionsRequest =
  WssPerformanceDeepDiveHubDestinationsArgs;
export type WSSDestinationOptionsResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: Pick<
        WssPerformanceDeepDiveHub,
        "destinations"
      > | null;
    };
  } | null;
};

export const WSSCarrierOptionsQuery = gql`
  query OrderMetricsDeepDive_WSSCarrierOptions(
    $pageType: WSSDeepDivePageType!
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          carriers(pageType: $pageType)
        }
      }
    }
  }
`;
export type WSSCarrierOptionsRequest = WssPerformanceDeepDiveHubCarriersArgs;
export type WSSCarrierOptionsResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: Pick<WssPerformanceDeepDiveHub, "carriers"> | null;
    };
  } | null;
};

export const WSSUnfulfilledReasonOptionsQuery = gql`
  query OrderMetricsDeepDive_WSSUnfulfilledReasonOptions {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          unfulfilledReasons
        }
      }
    }
  }
`;
export type WSSUnfulfilledReasonOptionsResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: Pick<
        WssPerformanceDeepDiveHub,
        "unfulfilledReasons"
      > | null;
    };
  } | null;
};

export const WSSLogisticsRefundReasonOptionsQuery = gql`
  query OrderMetricsDeepDive_WSSLogisticsRefundReasonOptions {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          logisticsRefundReasons
        }
      }
    }
  }
`;
export type WSSLogisticsRefundReasonOptionsResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: Pick<
        WssPerformanceDeepDiveHub,
        "logisticsRefundReasons"
      > | null;
    };
  } | null;
};

export const WSSQualityRefundReasonOptionsQuery = gql`
  query OrderMetricsDeepDive_WSSQualityRefundReasonOptions(
    $productId: ObjectIdType!
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          qualityRefundReasons(productId: $productId)
        }
      }
    }
  }
`;
export type WSSQualityRefundReasonOptionsRequest =
  WssPerformanceDeepDiveHubQualityRefundReasonsArgs;
export type WSSQualityRefundReasonOptionsResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: Pick<
        WssPerformanceDeepDiveHub,
        "qualityRefundReasons"
      > | null;
    };
  } | null;
};

export const WSSProductQualityRefundQuery = gql`
  query OrderMetricsDeepDive_ProductQualityRefund(
    $offset: Int
    $limit: Int
    $sortField: SortProductQualityRefundField
    $sortOrder: SortByOrder
    $productIds: [ObjectIdType!]
    $isBadByRefund: Boolean
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          productQualityRefund(
            offset: $offset
            limit: $limit
            sortField: $sortField
            sortOrder: $sortOrder
            productIds: $productIds
            isBadByRefund: $isBadByRefund
          ) {
            totalCount
            dataSlice {
              productId
              productName
              productImageUrl
              receivedOrders
              qualityRefundIssued
              qualityRefundRate
            }
          }
        }
      }
    }
  }
`;
export type WSSProductQualityRefundRequest =
  WssPerformanceDeepDiveHubProductQualityRefundArgs;
export type WSSProductQualityRefundResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: {
        readonly productQualityRefund: {
          readonly totalCount: number;
          readonly dataSlice: ReadonlyArray<
            Pick<
              WssProductRefund,
              | "productId"
              | "productName"
              | "productImageUrl"
              | "receivedOrders"
              | "qualityRefundIssued"
              | "qualityRefundRate"
            >
          >;
        };
      };
    };
  };
};

export const WSSOrderQualityRefundQuery = gql`
  query OrderMetricsDeepDive_OrderQualityRefund(
    $offset: Int
    $limit: Int
    $sortField: SortOrderTransactionDateField
    $sortOrder: SortByOrder
    $productId: ObjectIdType
    $refundReasons: [WSSQualityRefundReason!]
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          orderQualityRefund(
            offset: $offset
            limit: $limit
            sortField: $sortField
            sortOrder: $sortOrder
            productId: $productId
            refundReasons: $refundReasons
          ) {
            totalCount
            dataSlice {
              orderId
              transactionDate {
                unix
              }
              carrier
              refundReason
            }
          }
        }
      }
    }
  }
`;
export type WSSOrderQualityRefundRequest =
  WssPerformanceDeepDiveHubOrderQualityRefundArgs;
export type WSSOrderQualityRefundResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: {
        readonly orderQualityRefund: {
          readonly totalCount: number;
          readonly dataSlice: ReadonlyArray<
            Pick<WssOrderRefund, "orderId" | "carrier" | "refundReason"> & {
              readonly transactionDate: Pick<Datetime, "unix">;
            }
          >;
        };
      };
    };
  };
};

export const WSSQualityRefundBreakdownQuery = gql`
  query OrderMetricsDeepDive_QualityRefundBreakdown($productId: ObjectIdType) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          qualityRefundBreakdown(productId: $productId) {
            productId
            reason
            count
          }
        }
      }
    }
  }
`;
export type WSSQualityRefundBreakdownRequest =
  WssPerformanceDeepDiveHubQualityRefundBreakdownArgs;
export type WSSQualityRefundBreakdownResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: Pick<
        WssPerformanceDeepDiveHub,
        "qualityRefundBreakdown"
      >;
    };
  };
};

export const WSSConfirmedFulfillmentSpeedQuery = gql`
  query OrderMetricsDeepDive_ConfirmedFulfillmentSpeed(
    $offset: Int
    $limit: Int
    $sortField: SortOrderFulfillmentSpeed
    $sortOrder: SortByOrder
    $orderIds: [ObjectIdType!]
    $destinations: [String!]
    $carriers: [String!]
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          orderFulfillmentSpeed(
            offset: $offset
            limit: $limit
            sortField: $sortField
            sortOrder: $sortOrder
            orderIds: $orderIds
            destinations: $destinations
            carriers: $carriers
          ) {
            totalCount
            dataSlice {
              orderId
              transactionDate {
                unix
              }
              trackingId
              carrier
              fulfillmentSpeed {
                days
                hours
                minutes
                seconds
              }
              destination
            }
          }
        }
      }
    }
  }
`;
export type WSSConfirmedFulfillmentSpeedRequest =
  WssPerformanceDeepDiveHubOrderFulfillmentSpeedArgs;
export type WSSConfirmedFulfillmentSpeedResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: {
        readonly orderFulfillmentSpeed: {
          readonly totalCount: number;
          readonly dataSlice: ReadonlyArray<
            Pick<
              WssOrderFulfillment,
              | "orderId"
              | "trackingId"
              | "carrier"
              | "fulfillmentSpeed"
              | "destination"
            > & {
              readonly transactionDate: Pick<Datetime, "unix">;
            }
          >;
        };
      };
    };
  };
};

export const WSSValidTrackingRateQuery = gql`
  query OrderMetricsDeepDive_ValidTrackingRate(
    $offset: Int
    $limit: Int
    $sortField: SortOrderTransactionDateField
    $sortOrder: SortByOrder
    $orderIds: [ObjectIdType!]
    $destinations: [String!]
    $carriers: [String!]
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          destinationsInFulfillment
          carriersInFulfillment
          orderInvalidTracking(
            offset: $offset
            limit: $limit
            sortField: $sortField
            sortOrder: $sortOrder
            orderIds: $orderIds
            destinations: $destinations
            carriers: $carriers
          ) {
            totalCount
            dataSlice {
              orderId
              transactionDate {
                unix
              }
              carrier
              destination
            }
          }
        }
      }
    }
  }
`;
export type WSSValidTrackingRateRequest =
  WssPerformanceDeepDiveHubOrderInvalidTrackingArgs;
export type WSSValidTrackingRateResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: Pick<
        WssPerformanceDeepDiveHub,
        "destinationsInFulfillment" | "carriersInFulfillment"
      > & {
        readonly orderInvalidTracking: {
          readonly totalCount: number;
          readonly dataSlice: ReadonlyArray<
            Pick<WssOrderFulfillment, "orderId" | "carrier" | "destination"> & {
              readonly transactionDate: Pick<Datetime, "unix">;
            }
          >;
        };
      };
    };
  };
};

export const WSSOrderLogisticsRefundQuery = gql`
  query OrderMetricsDeepDive_LogisticsRefundRate(
    $offset: Int
    $limit: Int
    $sortField: SortOrderTransactionDateField
    $sortOrder: SortByOrder
    $orderIds: [ObjectIdType!]
    $carriers: [String!]
    $refundReasons: [WSSLogisticsRefundReason!]
  ) {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          orderLogisticsRefund(
            offset: $offset
            limit: $limit
            sortField: $sortField
            sortOrder: $sortOrder
            orderIds: $orderIds
            carriers: $carriers
            refundReasons: $refundReasons
          ) {
            totalCount
            dataSlice {
              orderId
              transactionDate {
                unix
              }
              carrier
              refundReason
            }
          }
        }
      }
    }
  }
`;
export type WSSOrderLogisticsRefundRequest =
  WssPerformanceDeepDiveHubOrderLogisticsRefundArgs;
export type WSSOrderLogisticsRefundResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: {
        readonly orderLogisticsRefund: {
          readonly totalCount: number;
          readonly dataSlice: ReadonlyArray<
            Pick<WssOrderRefund, "carrier" | "orderId" | "refundReason"> & {
              readonly transactionDate: Pick<Datetime, "unix">;
            }
          >;
        };
      };
    };
  };
};

export const LegoSortOrder: {
  readonly [so in SortByOrder]: SortOrder;
} = {
  ASC: "asc",
  DESC: "desc",
};

export const GQLSortOrder: {
  readonly [so in Exclude<SortOrder, "not-applied">]: SortByOrder;
} = {
  asc: "ASC",
  desc: "DESC",
};
