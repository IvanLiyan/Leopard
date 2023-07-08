import { gql } from "@gql";
import {
  MerchantWarningSchema,
  MerchantWarningProofSchema,
  MerchantWarningReasonSchema,
  Datetime,
  OrderSchema,
  FulfillmentSchemaOrderArgs,
  CurrencyValue,
  ShippingDetailsSchema,
  ShippingProviderSchema,
  Timedelta,
  ProductSchema,
  Country,
  MerchantSchema,
  MerchantWishSellerStandardDetails,
  TrackingCheckpointResultingStateSchema,
  AddressSchema,
  OrderFbwDetailsSchema,
  OrderRefundReasonSchema,
  UserSchema,
  CannedResponseCategorySchema,
  PastOrderTrackingInfoSchema,
} from "@schema";

type PickedMerchantWarningReason = Pick<
  MerchantWarningReasonSchema,
  "reason" | "text"
>;

type PickedMerchantWarningProofSchema = Pick<
  MerchantWarningProofSchema,
  "id" | "type" | "disputeStatus"
>;

export type PickedMerchantWarningSchema = Pick<
  MerchantWarningSchema,
  "id" | "merchantReasonText" | "adminReasonText" | "correspondenceStatus"
> & {
  readonly reason: PickedMerchantWarningReason;
  readonly lastUpdate: Pick<Datetime, "formatted">;
  readonly createdTime: Pick<Datetime, "formatted">;
  readonly effectiveDisputeDeadlineDate: Pick<Datetime, "formatted"> & {
    readonly timeUntil: Pick<Timedelta, "days">;
  };
  readonly proofs?: ReadonlyArray<PickedMerchantWarningProofSchema> | null;
  readonly merchant: Pick<
    MerchantSchema,
    "id" | "displayName" | "daysToFulfill"
  > & {
    readonly wishSellerStandard?: Pick<
      MerchantWishSellerStandardDetails,
      "level"
    > | null;
  };
};

export type PickedCannedResponseCategorySchema = Pick<
  CannedResponseCategorySchema,
  "id" | "name"
>;

export type InfractionDetailsInitialData = {
  readonly currentUser: Pick<UserSchema, "hasPermission">;
  readonly policy?: {
    readonly cannedResponse: {
      readonly cannedResponseCategories?: ReadonlyArray<PickedCannedResponseCategorySchema> | null;
    };
    readonly merchantWarnings?: ReadonlyArray<PickedMerchantWarningSchema> | null;
  };
};

type PickedShippingProviderSchema = Pick<
  ShippingProviderSchema,
  "name" | "trackingUrl" | "providerUrl"
>;

type PickedShippingDetailsSchema = Pick<
  ShippingDetailsSchema,
  | "trackingId"
  | "name"
  | "streetAddress1"
  | "streetAddress2"
  | "city"
  | "state"
  | "phoneNumber"
  | "zipcode"
> & {
  readonly provider?: PickedShippingProviderSchema | null;
  readonly country?: Pick<Country, "name"> | null;
};

export type PickedTrackingCheckpointSchema = {
  readonly resultingTracking: Pick<
    TrackingCheckpointResultingStateSchema,
    "state" | "text"
  >;
  readonly date: Pick<Datetime, "formatted">;
};

type PickedOrderTrackingInfoSchema = {
  readonly confirmedFulfillmentDate?: Pick<Datetime, "formatted"> | null;
  readonly deliveredDate?: Pick<Datetime, "formatted"> | null;
  readonly checkpoints?: ReadonlyArray<PickedTrackingCheckpointSchema> | null;
};

type PickedProductSchema = Pick<
  ProductSchema,
  "id" | "smallPictureUrl" | "name"
>;

type PickedAddressSchema = Pick<
  AddressSchema,
  | "name"
  | "streetAddress1"
  | "streetAddress2"
  | "city"
  | "state"
  | "phoneNumber"
  | "zipcode"
> & {
  readonly country?: Pick<Country, "name"> | null;
};

type PickedWarehouseSchema = {
  readonly address?: PickedAddressSchema | null;
};

type PickedPastOrderTrackingInfoSchema = Pick<
  PastOrderTrackingInfoSchema,
  "trackingId"
> & {
  readonly checkpoints?: ReadonlyArray<PickedTrackingCheckpointSchema> | null;
  readonly lastUpdatedDate: Pick<Datetime, "formatted">;
  readonly provider?: PickedShippingProviderSchema | null;
};

type PickedOrderSchema = Pick<
  OrderSchema,
  | "id"
  | "state"
  | "isProcessing"
  | "isWishExpress"
  | "showAplusShippingAddressTooltip"
  | "isAdvancedLogistics"
  | "isBlueFusion"
> & {
  readonly shippedDate?: Pick<Datetime, "formatted"> | null;
  readonly orderTime?: Pick<Datetime, "formatted"> | null;
  readonly refundedTime?: Pick<Datetime, "formatted"> | null;
  readonly merchantTotal: Pick<CurrencyValue, "display">;
  readonly shippingDetails?: PickedShippingDetailsSchema | null;
  readonly tracking?: PickedOrderTrackingInfoSchema | null;
  readonly product: PickedProductSchema | null;
  readonly pastTracking: PickedPastOrderTrackingInfoSchema | null;
  readonly warehouse?: PickedWarehouseSchema | null;
  readonly fbwDetails?: Pick<OrderFbwDetailsSchema, "isFbw"> | null;
  readonly releasedTime?:
    | (Pick<Datetime, "formatted"> & {
        readonly timeUntil: Pick<Timedelta, "hours">;
      })
    | null;
  readonly refundItems?: ReadonlyArray<{
    readonly reasonInfo: Pick<OrderRefundReasonSchema, "reason" | "text">;
  }> | null;
};

export type OrderDetailsRequestData = FulfillmentSchemaOrderArgs;

export type OrderDetailsResponseData = {
  readonly fulfillment: {
    readonly order: PickedOrderSchema;
  };
};

export const ORDER_DETAILS_QUERY = gql(`
  query OrderDetails_InfractionDetails($id: String!) {
    fulfillment {
      order(id: $id) {
        id
        merchantTotal {
          display
        }
        state
        isWishExpress
        isProcessing
        showAplusShippingAddressTooltip
        isAdvancedLogistics
        isBlueFusion
        fbwDetails {
          isFbw
        }
        releasedTime {
          formatted(fmt: "M/d/YYYY h:mm a z")
          timeUntil {
            hours
          }
        }
        orderTime {
          formatted(fmt: "M/d/YYYY h:mm a z")
        }
        shippedDate {
          formatted(fmt: "M/d/YYYY h:mm a z")
        }
        refundedTime {
          formatted(fmt: "M/d/YYYY h:mm a z")
        }
        refundItems {
          reasonInfo {
            reason
            text
          }
        }
        shippingDetails {
          trackingId
          provider {
            name
            trackingUrl
            providerUrl
          }
          country {
            name
          }
          name
          streetAddress1
          streetAddress2
          city
          state
          zipcode
          phoneNumber
        }
        warehouse {
          address {
            name
            streetAddress1
            streetAddress2
            city
            state
            zipcode
            phoneNumber
            country {
              name
            }
          }
        }
        tracking {
          confirmedFulfillmentDate {
            formatted(fmt: "M/d/YYYY h:mm a z")
          }
          checkpoints {
            date {
              formatted(fmt: "YYYY/M/d")
            }
            resultingTracking {
              state
              text
            }
          }
          deliveredDate {
            formatted(fmt: "M/d/YYYY h:mm a z")
          }
        }
        product {
          id
          name
          smallPictureUrl
        }
        pastTracking {
          trackingId
          tracking {
            checkpoints {
              date {
                formatted(fmt: "YYYY/M/d")
              }
              resultingTracking {
                state
                text
              }
            }
          }
          provider {
            trackingUrl
            providerUrl
            name
          }
          lastUpdatedDate {
            formatted(fmt: "YYYY/d/M")
          }
        }
      }
    }
  }
`);
