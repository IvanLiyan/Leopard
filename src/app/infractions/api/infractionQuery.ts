import { gql } from "@apollo/client";
import {
  BrandAuthorizationSchema,
  BrandSchema,
  CounterfeitViolationSchema,
  CurrencyValue,
  Datetime,
  ImageSchema,
  InappropriateViolationSchema,
  MerchantWarningImpactSchema,
  MerchantWarningProofSchema,
  MerchantWarningReasonSchema,
  MerchantWarningSchema,
  OrderRefundReasonSchema,
  OrderSchema,
  ProductSchema,
  ShippingDetailsSchema,
  ShippingProviderSchema,
  TaggingViolationSubcategory,
  TakedownRequestSchema,
  TrackingCheckpointResultingStateSchema,
  TrackingDisputeSchema,
} from "@schema";
import {
  ReplyFields,
  REPLY_FIELDS,
  TrackingMessageFields,
  TRACKING_MESSAGE_FIELDS,
} from "./messagesQueries";

// note: we pre-fetch the initial messages to prime the
// cache for subsequent query. this reduces the time the
// messages component will be in the loading state
export const INFRACTION_QUERY = gql`
  ${REPLY_FIELDS}
  ${TRACKING_MESSAGE_FIELDS}
  query InfractionQuery(
    $infractionId: ObjectIdType
    $merchantId: ObjectIdType
  ) {
    policy {
      merchantWarning(id: $infractionId) {
        state
        wssImpact
        merchantActions
        outstandingMerchantActions
        reason {
          reason
        }
        productTrueTagInfo {
          counterfeitViolation {
            reason
          }
          inappropriateViolation {
            reason
          }
          subreason {
            subcategory
          }
        }
        createdTime {
          datetime
        }
        effectiveDisputeDeadlineDate {
          datetime
          unix
        }
        product {
          name
          id
          sku
          description
          mainImage {
            wishUrl(size: SMALL)
          }
        }
        proofs {
          type
          id
          message
          disputeStatus
        }
        impacts {
          type
          startDate {
            datetime
          }
          endDate {
            datetime
          }
        }
        order {
          id
          state
          merchantTotal {
            display
          }
          releasedTime {
            datetime
          }
          refundedTime {
            datetime
          }
          tracking {
            confirmedFulfillmentDate {
              datetime
            }
            deliveredDate {
              datetime
            }
            checkpoints {
              date {
                unix
              }
              resultingTracking {
                text
              }
            }
          }
          shippingDetails {
            trackingId
            provider {
              name
            }
          }
          refundItems {
            reasonInfo {
              text
            }
          }
        }
        trackingDispute {
          id
          state
          messages {
            ...TrackingMessageFields
          }
        }
        takedownRequest {
          name
          contact
          email
          phoneNumber
        }
        replies {
          ...ReplyFields
        }
      }
    }
    brand {
      brandAuthorizations(merchantId: $merchantId) {
        id
        brand {
          name
        }
      }
    }
  }
`;

export type InfractionQueryResponse = {
  readonly policy?: {
    readonly merchantWarning?: Pick<
      MerchantWarningSchema,
      "state" | "wssImpact" | "merchantActions" | "outstandingMerchantActions"
    > & {
      readonly reason: Pick<MerchantWarningReasonSchema, "reason">;
      readonly productTrueTagInfo?: {
        readonly counterfeitViolation: Pick<
          CounterfeitViolationSchema,
          "reason"
        >;
        readonly inappropriateViolation: Pick<
          InappropriateViolationSchema,
          "reason"
        >;
        readonly subreason?: Pick<TaggingViolationSubcategory, "subcategory">;
      };
      readonly createdTime: Pick<Datetime, "datetime">;
      readonly effectiveDisputeDeadlineDate: Pick<
        Datetime,
        "datetime" | "unix"
      >;
      readonly product?: Pick<
        ProductSchema,
        "name" | "id" | "sku" | "description"
      > & {
        readonly mainImage: Pick<ImageSchema, "wishUrl">;
      };
      readonly proofs: ReadonlyArray<
        Pick<
          MerchantWarningProofSchema,
          "type" | "id" | "message" | "disputeStatus"
        >
      >;
      readonly impacts?: ReadonlyArray<
        Pick<MerchantWarningImpactSchema, "type"> & {
          readonly startDate?: Pick<Datetime, "datetime">;
          readonly endDate?: Pick<Datetime, "datetime">;
        }
      >;
      readonly order?: Pick<OrderSchema, "id" | "state"> & {
        readonly merchantTotal: Pick<CurrencyValue, "display">;
        readonly releasedTime?: Pick<Datetime, "datetime">;
        readonly refundedTime?: Pick<Datetime, "datetime">;
        readonly tracking?: {
          readonly confirmedFulfillmentDate?: Pick<Datetime, "datetime">;
          readonly deliveredDate?: Pick<Datetime, "datetime">;
          readonly checkpoints?: ReadonlyArray<{
            readonly date: Pick<Datetime, "unix">;
            readonly resultingTracking: Pick<
              TrackingCheckpointResultingStateSchema,
              "text"
            >;
          }>;
        };
        readonly shippingDetails?: Pick<ShippingDetailsSchema, "trackingId"> & {
          readonly provider?: Pick<ShippingProviderSchema, "name">;
        };
        readonly refundItems?: ReadonlyArray<{
          readonly reasonInfo: Pick<OrderRefundReasonSchema, "text">;
        }>;
      };
      readonly trackingDispute?: Pick<TrackingDisputeSchema, "id" | "state"> & {
        readonly messages: ReadonlyArray<TrackingMessageFields>;
      };
      readonly takedownRequest?: Pick<
        TakedownRequestSchema,
        "name" | "contact" | "email" | "phoneNumber"
      >;
      readonly replies: ReadonlyArray<ReplyFields>;
    };
  };
  readonly brand?: {
    readonly brandAuthorizations?: ReadonlyArray<
      Pick<BrandAuthorizationSchema, "id"> & {
        readonly brand: Pick<BrandSchema, "name">;
      }
    >;
  };
};

export type InfractionQueryVariables = {
  readonly infractionId: string;
  readonly merchantId: string;
};
