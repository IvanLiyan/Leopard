import { gql } from "@apollo/client";
import {
  CurrencyValue,
  Datetime,
  ImageSchema,
  MerchantWarningImpactSchema,
  MerchantWarningProofSchema,
  MerchantWarningReasonSchema,
  MerchantWarningSchema,
  OrderRefundReasonSchema,
  OrderSchema,
  ProductSchema,
  ShippingDetailsSchema,
  ShippingProviderSchema,
  TakedownRequestSchema,
  TrackingCheckpointResultingStateSchema,
  TrackingDisputeSchema,
} from "@schema";

export const INFRACTION_QUERY = gql`
  query InfractionQuery($id: ObjectIdType) {
    policy {
      merchantWarning(id: $id) {
        state
        wssImpact
        merchantActions
        reason {
          reason
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
          state
        }
        takedownRequest {
          name
          contact
          email
          phoneNumber
        }
      }
    }
  }
`;

export type InfractionQueryResponse = {
  readonly policy?: {
    readonly merchantWarning?: Pick<
      MerchantWarningSchema,
      "state" | "wssImpact" | "merchantActions"
    > & {
      readonly reason: Pick<MerchantWarningReasonSchema, "reason">;
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
        readonly refundItems: ReadonlyArray<{
          readonly reasonInfo: Pick<OrderRefundReasonSchema, "text">;
        }>;
      };
      readonly trackingDispute?: Pick<TrackingDisputeSchema, "state">;
      readonly takedownRequest?: Pick<
        TakedownRequestSchema,
        "name" | "contact" | "email" | "phoneNumber"
      >;
    };
  };
};

export type InfractionQueryVariables = {
  readonly id: string;
};
