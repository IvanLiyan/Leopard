import gql from "graphql-tag";
import {
  Datetime,
  RefundDisputeSchema,
  RefundDisputeHub,
  RefundDisputeHubDisputesArgs,
  CurrencyValue,
  DisputeReasonSchema,
  DisputeState,
  DisputeReason,
} from "@schema/types";
import { Theme } from "@ContextLogic/lego";

export const REFUND_DISPUTES_QUERY = gql`
  query RefundDispute_RefundDisputesTable(
    $offset: Int
    $limit: Int
    $states: [DisputeState!]!
    $sort: DisputeSort
    $searchType: RefundDisputeSearchType
    $query: String
    $reasons: [DisputeReason!]
  ) {
    policy {
      dispute {
        refundDispute {
          disputeCount(
            states: $states
            query: $query
            searchType: $searchType
            reasons: $reasons
          )
          disputes(
            limit: $limit
            offset: $offset
            sort: $sort
            states: $states
            query: $query
            searchType: $searchType
            reasons: $reasons
          ) {
            id
            state
            lastUpdate {
              formatted(fmt: "M/d/YYYY h:mm a z")
            }
            orderId
            productId
            reason {
              text
              subReasonText
            }
            isReturnDispute
            disputeAmount {
              display
            }
          }
        }
      }
    }
  }
`;

type PickedDisputes = Pick<
  RefundDisputeSchema,
  "id" | "state" | "orderId" | "isReturnDispute" | "productId"
> & {
  readonly lastUpdate: Pick<Datetime, "formatted">;
  readonly disputeAmount: Pick<CurrencyValue, "display">;
  readonly reason: Pick<DisputeReasonSchema, "text" | "subReasonText">;
};

type PickedRefundDispute = Pick<RefundDisputeHub, "disputeCount"> & {
  readonly disputes?: ReadonlyArray<PickedDisputes> | null;
};

type PickedDispute = {
  readonly refundDispute?: PickedRefundDispute | null;
};

export type RefundDisputesQueryRequestData = RefundDisputeHubDisputesArgs;

export type RefundDisputesQueryResponseData = {
  readonly policy: {
    readonly dispute?: PickedDispute | null;
  };
};

export const RETURN_DISPUTE_REASONS: ReadonlyArray<DisputeReason> = [
  "MERCHANT_REPORT_RETURN",
];

export const REFUND_DISPUTE_REASONS: ReadonlyArray<DisputeReason> = [
  "MISLEADING_PRODUCT_TAG",
  "PRODUCT_HIGH_REFUND_RATIO",
  "DELIVERED_TO_WRONG_ADDRESS",
  "EPC_OVERWEIGHT",
  "FRAUDULENT_BEHAVIOR",
  "VALID_TRACKING",
  "INCOMPLETE_ORDER",
  "NOT_DELIVERED_ON_TIME",
  "STORE_UPLOADED_INVENTORY_RETURN",
  "PRODUCT_LOW_RATING",
  "RIGHT_OF_WITHDRAWAL",
  "FBS_ITEM_NOT_PICKUP",
  "CORRECT_SIZE",
  "ITEM_IS_DAMAGED",
  "EPC_OVERVALUE",
  "RETURNED_TO_SENDER",
  "ITEM_NOT_MATCH_LISTING",
  "WISHBLUE_EPC_LATE_FULFULLMENT",
  "OUT_OF_STOCK",
  "ITEM_MARKED_DELIVERED_BUT_DID_NOT_ARRIVE",
  "FAKE_TRACKING",
  "MERCHANT_HIGH_REFUND_EAT_COST",
  "ITEM_IS_DANGEROUS",
  "BANNED_MERCHANT",
  "NOT_QUALIFIED_SHIPPING_PROVIDER",
  "AUTHORIZED_TO_SELL",
  "EPC_LAST_MILE_CARRIERS_UNABLE_TO_SHIP",
  "EPC_OVERSIZE",
  "COUNTERFEIT_ITEM",
  "DID_NOT_ACCEPT_TOS_ON_TIME",
  "LATE_CONFIRMED_FULFILLMENT",
  "MERCHANT_REPORT_FRAUD",
];

export const StateLabel: {
  [type in DisputeState]: string;
} = {
  INVALID: i`Invalid`,
  AWAITING_ADMIN: i`Awaiting Wish`,
  AWAITING_MERCHANT: i`Action Required`,
  APPROVED: i`Approved`,
  PAID: i`Paid`,
  CLOSED: i`Closed`,
  CANCELLED: i`Cancelled`,
  NEW: i`New`,
};

export const ThemeColor: { [type in DisputeState]: Theme } = {
  INVALID: `Red`,
  AWAITING_ADMIN: `Yellow`,
  AWAITING_MERCHANT: `Yellow`,
  APPROVED: `LighterCyan`,
  PAID: `LighterCyan`,
  CLOSED: `Red`,
  CANCELLED: `Red`,
  NEW: `Grey`,
};
