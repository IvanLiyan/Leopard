import gql from "graphql-tag";

import {
  LedgerItemInfo,
  LedgerItem,
  Datetime,
  CurrencyValue,
  MerchantPaymentDetailLedgerItemInfoArgs,
  MerchantPaymentWarningMessage,
  MerchantPaymentLinkInfo,
  SentimentType,
  LedgerAccountBalance,
  LedgerItemDescriptionDetails,
  IdDetails,
} from "@schema/types";

import { AlertType } from "@ContextLogic/lego";

type PickedIdDetails = Pick<IdDetails, "id" | "redirectType">;

type PickedLedgerItemDescriptionDetails = Pick<
  LedgerItemDescriptionDetails,
  "descriptionText"
> & {
  readonly idDetailList?: ReadonlyArray<PickedIdDetails>;
};

type PickedLedgerItem = Pick<LedgerItem, "type" | "id"> & {
  readonly description: PickedLedgerItemDescriptionDetails;
  readonly debitAmount?: Pick<CurrencyValue, "display"> | null;
  readonly creditAmount?: Pick<CurrencyValue, "display"> | null;
  readonly createdTime: {
    readonly inTimezone: Pick<Datetime, "formatted">;
  };
  readonly paymentEligibleTime:
    | (Pick<Datetime, "formatted"> & {
        readonly inTimezone: Pick<Datetime, "iso8061" | "formatted">;
      })
    | null;
};

type PickedLedgerItemInfo = Pick<
  LedgerItemInfo,
  "itemCount" | "nextCutoffId"
> & {
  readonly itemList?: ReadonlyArray<PickedLedgerItem> | null;
  readonly nextCutoffTime?: {
    readonly inTimezone: Pick<Datetime, "iso8061">;
  } | null;
};

type PickedMerchantPaymentWarningMessage = Pick<
  MerchantPaymentWarningMessage,
  "sentiment" | "text" | "title"
> & {
  readonly link?: Pick<MerchantPaymentLinkInfo, "text" | "url"> | null;
};

export type PickedLedgerAccountBalance = Pick<
  LedgerAccountBalance,
  "balanceType" | "currency" | "amount"
>;

export type GetAccountBalanceRequestData =
  MerchantPaymentDetailLedgerItemInfoArgs;

export type GetAccountBalanceResponseData = {
  readonly payments: {
    readonly paymentInfo: {
      readonly messages?: ReadonlyArray<PickedMerchantPaymentWarningMessage> | null;
      readonly ledgerItemInfo?: PickedLedgerItemInfo | null;
    };
  };
};

export type AccountBalanceInitialData = {
  readonly payments: {
    readonly paymentInfo: {
      readonly ledgerAccountBalances: ReadonlyArray<PickedLedgerAccountBalance>;
    };
  };
};

export const AlertTypeMapping: {
  [key in SentimentType]: AlertType["sentiment"];
} = {
  INFO: "info",
  WARNING: "warning",
  NEGATIVE: "negative",
  POSITIVE: "positive",
};

export const GET_LEDGER_ACCOUNT_BALANCE = gql`
  query AccountBalance_GetLedgerAccountBalance(
    $currency: PaymentCurrencyCode!
    $limit: Int!
    $balanceType: LedgerAccountBalanceType!
    $startDate: DatetimeInput
    $endDate: DatetimeInput
    $cutoffTime: DatetimeInput
    $cutoffId: String
    $includeTotalCount: Boolean
  ) {
    payments {
      paymentInfo {
        messages {
          sentiment
          text
          link {
            url
            text
          }
        }
        ledgerItemInfo(
          currency: $currency
          balanceType: $balanceType
          cutoffTime: $cutoffTime
          cutoffId: $cutoffId
          limit: $limit
          startDate: $startDate
          endDate: $endDate
          includeTotalCount: $includeTotalCount
        ) {
          itemList {
            id
            debitAmount {
              display
            }
            creditAmount {
              display
            }
            type
            description {
              descriptionText
              idDetailList {
                id
                redirectType
              }
            }
            paymentEligibleTime {
              formatted(fmt: "M/d/YYYY h:mm a z")
              inTimezone(identifier: "Etc/UTC") {
                iso8061
                formatted(fmt: "%Y-%m-%d %H:%M:%S UTC")
              }
            }
            createdTime {
              inTimezone(identifier: "Etc/UTC") {
                formatted(fmt: "%Y-%m-%d %H:%M:%S UTC")
              }
            }
          }
          itemCount
          nextCutoffTime {
            inTimezone(identifier: "Etc/UTC") {
              iso8061
            }
          }
          nextCutoffId
        }
      }
    }
  }
`;
