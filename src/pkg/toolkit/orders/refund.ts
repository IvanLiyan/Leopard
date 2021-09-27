import gql from "graphql-tag";

import {
  RefundError,
  OrderRefundReasonSchema,
  CurrencyValue,
  OrderTrackingInfoSchema,
  FulfillmentMutationCancelWpsTrackingIdArgs,
  CancelWpsTrackingIdMutation,
  OrderRefundBuyerFraudSubreasonSchema,
} from "@schema/types";

export const GET_ORDER_DETAIL = gql`
  query RefundOrderModal_GetDetails($orderId: String!) {
    fulfillment {
      order(id: $orderId) {
        validRefundReasons {
          text
          reason
        }
        wpsFulfillment {
          shipmentFee {
            totalFee {
              display
              currencyCode
            }
          }
          shippingOptionId
        }
      }
    }
    platformConstants {
      buyerFraudReasons {
        reason
        text
      }
    }
  }
`;

export type GetOrderDetailArgs = {
  readonly orderId: string;
};

type PickedOrder = {
  readonly validRefundReasons: ReadonlyArray<
    Pick<OrderRefundReasonSchema, "text" | "reason">
  >;
  readonly tracking?: Pick<OrderTrackingInfoSchema, "isTrackingConfirmed">;
  readonly wpsFulfillment?: {
    readonly shipmentFee?: {
      readonly totalFee: Pick<CurrencyValue, "display" | "currencyCode">;
    };
  };
};

type PickedBuyerFraudReasons = Pick<
  OrderRefundBuyerFraudSubreasonSchema,
  "reason" | "text"
>;

type PickedPlatformConstants = {
  readonly buyerFraudReasons?: PickedBuyerFraudReasons[];
};

export type GetOrderDetailResponse = {
  readonly fulfillment: {
    readonly order?: PickedOrder | null;
  };
  readonly platformConstants: PickedPlatformConstants;
};

export const REFUND_ORDERS_MUTATION = gql`
  mutation ConfirmRefundModal_RefundTransactionsMutation(
    $input: [RefundOrderInput!]!
  ) {
    fulfillment {
      refundOrders(input: $input) {
        errorMessages {
          message
        }
      }
    }
  }
`;

export type RefundMutationResponse = {
  readonly fulfillment: {
    readonly refundOrders: {
      readonly errorMessages?: null | ReadonlyArray<
        Pick<RefundError, "message">
      >;
    };
  };
};

export const CANCEL_WPS_LABEL_MUTATION = gql`
  mutation ConfirmRefundModal_CancelWpsLabelMutation(
    $input: CancelWPSTrackingIDInput!
  ) {
    fulfillment {
      cancelWpsTrackingId(input: $input) {
        ok
        errorMessage
      }
    }
  }
`;

export type CancelWpsLabelInputType = FulfillmentMutationCancelWpsTrackingIdArgs;
export type CancelWpsLabelResponseType = {
  readonly fulfillment: {
    readonly cancelWpsTrackingId: Pick<
      CancelWpsTrackingIdMutation,
      "ok" | "errorMessage"
    >;
  };
};
