import { Theme } from "@ContextLogic/lego";
import {
  DisputeReason,
  DisputeReasonSchema,
  DisputeState,
  RefundDisputeSchema,
  Datetime,
  OrderSchema,
  WishUserSchema,
  CurrencyValue,
  ProductSchema,
  OrderRefundItemsSummarySchema,
  OrderRefundItemSchema,
  OrderRefundPaymentSchema,
  DisputeMessageSchema,
  RefundDisputeMutationsReplyArgs,
  RefundDisputeReplyMutation,
  MerchantFileSchema,
} from "@schema/types";
import gql from "graphql-tag";

export type PickedOrder = Pick<
  OrderSchema,
  "id" | "sizeAtPurchaseTime" | "colorAtPurchaseTime" | "quantity" | "state"
> & {
  readonly customer: {
    readonly user?: Pick<WishUserSchema, "name"> | null;
  };
  readonly priceCost: Pick<CurrencyValue, "display">;
  readonly shippingCost: Pick<CurrencyValue, "display">;
  readonly totalCost: Pick<
    CurrencyValue,
    "display" | "amount" | "currencyCode"
  >;
  readonly product?: Pick<ProductSchema, "name" | "id" | "sku"> | null;
  readonly refundItemsSummary?: Pick<
    OrderRefundItemsSummarySchema,
    "isPartialAmountRefunded" | "refundedPercentage" | "refundedQuantity"
  > | null;
  readonly orderTime?: Pick<Datetime, "formatted"> | null;
  readonly shippedDate?: Pick<Datetime, "formatted"> | null;
  readonly refundedTime?: Pick<Datetime, "formatted"> | null;
  readonly refundItems?: ReadonlyArray<
    Pick<OrderRefundItemSchema, "disputeId"> & {
      readonly payment: Pick<OrderRefundPaymentSchema, "id">;
    }
  > | null;
};

export type PickedDisputeMessage = Pick<
  DisputeMessageSchema,
  "type" | "message" | "senderName" | "senderType"
> & {
  readonly date: Pick<Datetime, "formatted">;
  readonly files: ReadonlyArray<
    Pick<MerchantFileSchema, "id" | "displayFilename" | "fileUrl">
  >;
};

export type PickedRefundDispute = Pick<RefundDisputeSchema, "id" | "state"> & {
  readonly reason: Pick<DisputeReasonSchema, "reason">;
  readonly lastUpdate: Pick<Datetime, "formatted">;
  readonly order: PickedOrder;
  readonly messages: ReadonlyArray<PickedDisputeMessage>;
};

export type RefundDisputeDetailsInitialData = {
  readonly policy?: {
    readonly dispute?: {
      readonly refundDispute?: {
        readonly dispute?: PickedRefundDispute | null;
      };
    } | null;
  } | null;
};

// Reply Mutation
export const REFUND_DISPUTE_REPLY_MUTATION = gql`
  mutation RefundDisputeDetails_RefundDisputeReplyMutation(
    $input: RefundDisputeReplyMutationInput!
  ) {
    policy {
      refundDispute {
        reply(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

export type RefundDisputeReplyResponse = {
  readonly policy?: {
    readonly refundDispute?: {
      readonly reply?: Pick<
        RefundDisputeReplyMutation,
        "ok" | "message"
      > | null;
    } | null;
  } | null;
};

export type RefundDisputeReplyRequest = RefundDisputeMutationsReplyArgs;

// Constants
export const DisputeReasonDisplayText: {
  readonly [T in DisputeReason]: string | null;
} = {
  CORRECT_SIZE: i`Item was shipped with correct size`,
  VALID_TRACKING: i`I can prove the order had valid tracking on the refund date`,
  AUTHORIZED_TO_SELL: i`I am authorized to sell this product`,
  FRAUDULENT_BEHAVIOR: i`My behavior is not fraudulent`,
  NOT_DELIVERED_ON_TIME: i`I can prove the package was confirmed delivered by the delivery date`,
  LATE_CONFIRMED_FULFILLMENT: i`The package was shipped earlier than the confirmed fulfillment date`,
  ITEM_IS_DAMAGED: i`The package was not damaged when it arrived`,
  ITEM_NOT_MATCH_LISTING: i`The item shipped matches the listing the user saw when the order was placed`,
  BANNED_MERCHANT: i`The merchant account was not suspended when the order was refunded`,
  DELIVERED_TO_WRONG_ADDRESS: i`The item was shipped to the correct address`,
  INCOMPLETE_ORDER:
    i`The order shipped contains all parts of the item and the ` +
    i`correct quantity for the item`,
  COUNTERFEIT_ITEM: i`The item is not counterfeit`,
  RETURNED_TO_SENDER: i`The item is not returned to sender`,
  OUT_OF_STOCK: i`The order was fulfilled`,
  ITEM_MARKED_DELIVERED_BUT_DID_NOT_ARRIVE: i`The user received the item`,
  MERCHANT_REPORT_FRAUD: i`This order was refunded due to customer refund abuse`,
  DID_NOT_ACCEPT_TOS_ON_TIME:
    i`This order was refunded after you have accepted ` +
    i`the new Merchant Terms of Service`,
  PRODUCT_HIGH_REFUND_RATIO: i`This order is not for a product with a high refund ratio`,
  PRODUCT_LOW_RATING: i`This order is not for a product with low ratings`,
  NOT_QUALIFIED_SHIPPING_PROVIDER: i`This order is not shipped with a qualified shipping provider`,
  FAKE_TRACKING: i`This order is not shipped with a qualified shipping provider`,
  MERCHANT_HIGH_REFUND_EAT_COST: i`This order was not refunded when the store had a high refund ratio`,
  MERCHANT_REPORT_RETURN: i`This order was not properly returned`,
  WISHBLUE_EPC_LATE_FULFULLMENT: i`This order arrived at collection warehouse on time`,
  ITEM_IS_DANGEROUS: null,
  MISLEADING_PRODUCT_TAG: null,
  FBS_ITEM_NOT_PICKUP: i`This FBS item has not been picked up from store`,
  EPC_OVERWEIGHT: null,
  EPC_OVERSIZE: null,
  EPC_LAST_MILE_CARRIERS_UNABLE_TO_SHIP: null,
  STORE_UPLOADED_INVENTORY_RETURN: i`This order was not properly returned to the store`,
  EPC_OVERVALUE: null,
  RIGHT_OF_WITHDRAWAL: null,
};

export const DisputeReasonPolicyNumberViolated: {
  readonly [T in DisputeReason]: string | null;
} = {
  CORRECT_SIZE: "7.6",
  VALID_TRACKING: "7.3",
  AUTHORIZED_TO_SELL: "7.12",
  FRAUDULENT_BEHAVIOR: "7.7",
  NOT_DELIVERED_ON_TIME: "7.5",
  LATE_CONFIRMED_FULFILLMENT: "7.4",
  ITEM_IS_DAMAGED: "7.8",
  ITEM_NOT_MATCH_LISTING: "7.9",
  BANNED_MERCHANT: "7.10",
  DELIVERED_TO_WRONG_ADDRESS: "7.13",
  INCOMPLETE_ORDER: "7.14",
  COUNTERFEIT_ITEM: "7.12",
  RETURNED_TO_SENDER: "7.15",
  OUT_OF_STOCK: "7.1",
  ITEM_MARKED_DELIVERED_BUT_DID_NOT_ARRIVE: "7.17",
  MERCHANT_REPORT_FRAUD: null,
  DID_NOT_ACCEPT_TOS_ON_TIME: null,
  PRODUCT_HIGH_REFUND_RATIO: null,
  PRODUCT_LOW_RATING: null,
  NOT_QUALIFIED_SHIPPING_PROVIDER: null,
  FAKE_TRACKING: null,
  MERCHANT_HIGH_REFUND_EAT_COST: null,
  MERCHANT_REPORT_RETURN: null,
  WISHBLUE_EPC_LATE_FULFULLMENT: null,
  ITEM_IS_DANGEROUS: null,
  MISLEADING_PRODUCT_TAG: null,
  FBS_ITEM_NOT_PICKUP: null,
  EPC_OVERWEIGHT: null,
  EPC_OVERSIZE: null,
  EPC_LAST_MILE_CARRIERS_UNABLE_TO_SHIP: null,
  STORE_UPLOADED_INVENTORY_RETURN: null,
  EPC_OVERVALUE: null,
  RIGHT_OF_WITHDRAWAL: null,
};

export const DisputeStateLabelData: {
  readonly [T in DisputeState]: {
    readonly text: string;
    readonly theme: Theme;
  };
} = {
  INVALID: {
    text: i`Invalid`,
    theme: `Red`,
  },
  AWAITING_ADMIN: {
    text: i`Awaiting Admin`,
    theme: `Yellow`,
  },
  PAID: {
    text: i`Paid`,
    theme: `DarkPalaceBlue`,
  },
  CLOSED: {
    text: i`Closed`,
    theme: `DarkPalaceBlue`,
  },
  CANCELLED: {
    text: i`Cancelled`,
    theme: `Red`,
  },
  NEW: {
    text: i`New`,
    theme: `Grey`,
  },
  AWAITING_MERCHANT: {
    text: i`Awaiting Merchant`,
    theme: `Yellow`,
  },
  APPROVED: {
    text: i`Approved`,
    theme: `LighterCyan`,
  },
};
