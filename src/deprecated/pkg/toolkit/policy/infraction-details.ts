import gql from "graphql-tag";
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
  TrackingDisputeSchema,
  TrackingDisputeMessageSchema,
  MerchantFileSchema,
  TrackingDisputeHubDisputesArgs,
  TrackingDisputeState,
  OrderRefundReasonSchema,
  UserSchema,
  CannedResponseCategorySchema,
  CannedResponseHubCannedResponsesArgs,
  CannedResponseSchema,
  CannedResponseHubFilledCannedResponseTextArgs,
  FilledCannedResponseTextSchema,
  PastOrderTrackingInfoSchema,
} from "@schema/types";
import { Theme } from "@ContextLogic/lego";

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
  "id" | "merchantReasonText" | "adminReasonText"
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

export const ORDER_DETAILS_QUERY = gql`
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
`;

type PickedMerchantFileSchema = Pick<
  MerchantFileSchema,
  "fileUrl" | "id" | "displayFilename"
>;

export type PickedTrackingDisputeMessageSchema = Pick<
  TrackingDisputeMessageSchema,
  "senderName" | "type" | "message" | "senderType"
> & {
  readonly date: Pick<Datetime, "formatted">;
  readonly files: ReadonlyArray<PickedMerchantFileSchema>;
};

export type PickedTrackingDisputeSchema = Pick<
  TrackingDisputeSchema,
  | "state"
  | "id"
  | "carrierSiteLink"
  | "warehouseCountry"
  | "reportedCountry"
  | "reportedState"
  | "orderInfractionDisputeSubreason"
> & {
  readonly reportedDeliveredDate?: Pick<Datetime, "formatted"> | null;
  readonly reportedFulfillmentDate?: Pick<Datetime, "formatted"> | null;
  readonly createDate: Pick<Datetime, "formatted">;
  readonly messages: ReadonlyArray<PickedTrackingDisputeMessageSchema>;
};

export type InfractionDisputeRequestData = TrackingDisputeHubDisputesArgs;

export type InfractionDisputeResponseData = {
  readonly policy: {
    readonly dispute: {
      readonly trackingDispute: {
        readonly disputes?: ReadonlyArray<PickedTrackingDisputeSchema> | null;
      };
    };
  };
};

export const INFRACTION_DISPUTE_QUERY = gql`
  query InfractionDispute_InfractionDetails(
    $query: String
    $states: [TrackingDisputeState!]!
  ) {
    policy {
      dispute {
        trackingDispute {
          disputes(query: $query, states: $states, searchType: ORDER_ID) {
            state
            id
            createDate {
              formatted(fmt: "M/d/YYYY h:mm a z")
            }
            orderInfractionDisputeSubreason
            carrierSiteLink
            warehouseCountry
            reportedCountry
            reportedState
            reportedDeliveredDate {
              formatted(fmt: "M/d/YYYY h:mm a z")
            }
            reportedFulfillmentDate {
              formatted(fmt: "M/d/YYYY h:mm a z")
            }
            messages {
              date {
                formatted(fmt: "MMM d, h:mm a")
              }
              senderName
              senderType
              message
              type
              files {
                id
                fileUrl
                displayFilename
              }
            }
          }
        }
      }
    }
  }
`;

export type PickedCannedResponseSchema = Pick<
  CannedResponseSchema,
  "id" | "name"
>;

export type AdminCannedResponseRequestData =
  CannedResponseHubCannedResponsesArgs;

export type AdminCannedResponseResponseData = {
  readonly policy?: {
    readonly cannedResponse: {
      readonly cannedResponses?: ReadonlyArray<PickedCannedResponseSchema> | null;
    };
  };
};

export const ADMIN_CANNED_RESPONSE_QUERY = gql`
  query AdminCannedResponse_InfractionDetails(
    $category: ObjectIdType
    $locale: Locale
    $feature: CannedResponseFeature!
  ) {
    policy {
      cannedResponse {
        cannedResponses(
          category: $category
          feature: $feature
          locale: $locale
        ) {
          id
          name
        }
      }
    }
  }
`;

export type PickedFilledCannedResponseTextSchema = Pick<
  FilledCannedResponseTextSchema,
  "text"
>;

export type AdminCannedResponseTextRequestData =
  CannedResponseHubFilledCannedResponseTextArgs;

export type AdminCannedResponseTextResponseData = {
  readonly policy?: {
    readonly cannedResponse: {
      readonly filledCannedResponseText?: PickedFilledCannedResponseTextSchema | null;
    };
  };
};

export const ADMIN_CANNED_RESPONSE_TEXT_QUERY = gql`
  query AdminCannedResponse_InfractionDetails(
    $cannedResponseId: ObjectIdType!
    $searchId: ObjectIdType!
    $searchType: FilledCannedResponseSearchType
  ) {
    policy {
      cannedResponse {
        filledCannedResponseText(
          cannedResponseId: $cannedResponseId
          searchId: $searchId
          searchType: $searchType
        ) {
          text
        }
      }
    }
  }
`;

export const DisputeStateLabel: {
  [type in TrackingDisputeState]: string;
} = {
  AWAITING_ADMIN: i`Awaiting review`,
  AWAITING_MERCHANT: i`Awaiting merchant`,
  APPROVED: i`Approved`,
  CANCELLED: i`Cancelled`,
  DECLINED: i`Declined`,
};

export const DisputeThemeColor: { [type in TrackingDisputeState]: Theme } = {
  AWAITING_ADMIN: `Yellow`,
  AWAITING_MERCHANT: `Yellow`,
  APPROVED: `LighterCyan`,
  CANCELLED: `Red`,
  DECLINED: `Red`,
};
