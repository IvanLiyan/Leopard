import gql from "graphql-tag";
import {
  Datetime,
  MerchantWarningSchema,
  PolicySchema,
  PolicySchemaMerchantWarningsArgs,
  CurrencyValue,
  MerchantWarningReasonSchema,
  MerchantWarningReason,
  TrackingDisputeSchema,
} from "@schema/types";

export const MERCHANT_WARNINGS_QUERY = gql`
  query MerchantWarnings_MerchantWarningsTable(
    $offset: Int
    $limit: Int
    $states: [MerchantWarningState!]
    $sort: MerchantWarningSort
    $id: ObjectIdType
    $reasons: [MerchantWarningReason!]
  ) {
    policy {
      merchantWarningReasons {
        text
        reason
      }
      merchantWarningCount(states: $states, id: $id, reasons: $reasons)
      merchantWarnings(
        limit: $limit
        offset: $offset
        sort: $sort
        states: $states
        id: $id
        reasons: $reasons
      ) {
        id
        reason {
          reason
          text
        }
        auditStatus
        merchantReasonText
        adminReasonText
        createdTime {
          formatted(fmt: "M/d/YYYY h:mm a z")
        }
        lastUpdate {
          formatted(fmt: "M/d/YYYY h:mm a z")
        }
        fineAmount {
          display
        }
        trackingDispute {
          state
        }
      }
    }
  }
`;

type PickedMerchantWarning = Pick<
  MerchantWarningSchema,
  "id" | "auditStatus" | "merchantReasonText" | "adminReasonText"
> & {
  readonly lastUpdate: Pick<Datetime, "formatted">;
  readonly createdTime: Pick<Datetime, "formatted">;
  readonly fineAmount?: Pick<CurrencyValue, "display"> | null;
  readonly reason: PickedMerchantWarningReasons;
  readonly trackingDispute?: Pick<TrackingDisputeSchema, "state"> | null;
};

export type MerchantWarningsQueryRequestData = PolicySchemaMerchantWarningsArgs;

type PickedMerchantWarningReasons = Pick<
  MerchantWarningReasonSchema,
  "reason" | "text"
>;

export type MerchantWarningsQueryResponseData = {
  readonly policy: Pick<PolicySchema, "merchantWarningCount"> & {
    readonly merchantWarnings?: ReadonlyArray<PickedMerchantWarning> | null;
    readonly merchantWarningReasons: ReadonlyArray<PickedMerchantWarningReasons>;
  };
};

export type MerchantWarningsInitialData = {
  readonly policy: Pick<PolicySchema, "merchantWarningCount">;
};

const WARNING_REASONS_INAPPROPRIATE_CS: ReadonlyArray<MerchantWarningReason> = [
  "REQUEST_USER_EMAIL",
  "REQUEST_MONEY",
  "BAD_CUSTOMER_SERVICE",
  "DISINGENUOUS_CUSTOMER_SERVICE",
  "TAKE_USER_OUTSIDE_WISH",
  "CS_LATE_RESPONSE_RATE",
];

const WARNING_REASONS_IP_INFRINGEMENT: ReadonlyArray<MerchantWarningReason> = [
  "COUNTERFEIT_GOODS",
  "VIOLATE_POLICY",
  "RELATED_ACCOUNT_IS_BANNED",
  "FINE_FOR_COUNTERFEIT_GOODS",
  "FINE_UPDATE_TO_COUNTERFEIT",
  "REPEAT_IP_INFRINGEMENT_ON_BRAND_OWNER",
  "LEGAL_TRO_TAKEDOWN",
  "VIOLATION_OF_TERMS",
  "HIGH_IP_INFRINGEMENT",
  "STRIKE_BASED_HIGH_RISK_PROHIBITED",
  "INVALID_EU_RESPONSIBLE_PERSON",
  "VIOLATE_TS_POLICY",
];

const WARNING_REASONS_ACCOUNT: ReadonlyArray<MerchantWarningReason> = [
  "DUPLICATE_ACCOUNTS",
  "MERCHANT_CONTACT_INFO_INVALID",
  "RESPOND_TO_ADMIN",
  "WISHPOST_NEGATIVE_BALANCE",
  "WISHPOST_ID_NOT_COMPLETE_FACE_RECOGNITION",
  "TAX_SETTING_NOT_UPDATED",
  "STORE_VALIDATION_INCOMPLETE",
  "US_TAX_INFO_UNVALIDATED",
];

const WARNING_REASONS_ORDERS: ReadonlyArray<MerchantWarningReason> = [
  "UNFULFILLED_ORDER",
  "PENALTY_FOR_AUTO_REFUND",
  "HIGH_AUTO_REFUND",
  "UNCONFIRMED_TRACKING_NUMBERS",
  "EMPTY_PACKAGES",
  "INVALID_TRACKING_NUMBERS",
  "FAKE_TRACKING",
  "CONFIRMED_DELIVERY_POLICY",
  "FINE_WISH_EXPRESS_POLICY_VIOLATION",
  "WAREHOUSE_FULFILLMENT_POLICY_VIOLATION",
  "WISH_EXPRESS_POLICY_VIOLATION",
  "MERCHANT_CANCELLATION_VIOLATION",
  "LATE_CONFIRMED_FULFILLMENT_VIOLATION",
];

const WARNING_REASONS_PRODUCT: ReadonlyArray<MerchantWarningReason> = [
  "DEP_FINE_DISABLE_PROMOTED_PRODUCT",
  "PRODUCT_HIGH_REFUND_RATIO",
  "PRODUCT_HIGH_REFUND_RATIO_NO_REMOVE",
  "DUPLICATE_PRODUCTS",
  "PRODUCT_LOW_RATING",
  "PRODUCT_LOW_RATING_NO_REMOVE",
  "FINE_PRODUCT_SWAPPED",
  "PRODUCT_HIGH_QUALITY_REFUND_RATIO",
  "EXTREMELY_HIGH_PRICE_SPREAD",
  "DEP_FINE_DISABLE_PROMOTED_PRODUCT_FOR_COUNTRY",
  "WISH_EXPRESS_POLICY_PRODUCT",
  "MISLEADING_VARIATION",
  "PRODUCT_HIGH_CANCEL_ORDER_RATE",
  "CN_PROHIBITED_PRODUCTS",
  "PRODUCT_GEOBLOCK",
];

const WARNING_REASONS_STORE: ReadonlyArray<MerchantWarningReason> = [
  "HIGH_REFUND_RATIO",
  "HIGH_CHARGEBACK_RATIO",
  "HIGH_CHARGEBACK_AND_FRAUD_REFUND_RATIO",
  "LATE_FULFILLMENT_RATE",
  "WISH_EXPRESS_POLICY_MERCHANT",
  "MERCHANT_HIGH_REFUND_EAT_COST",
  "MERCHANT_HIGH_QUALITY_REFUND_RATIO",
  "REUPLOADING_COUNTERFEITS",
  "REPEAT_PRODUCT_SWAPPING",
  "DECEPTIVE_FULFILLMENT",
  "HIGH_GMV_FROM_MISLEADING_PRODUCTS",
  "HIGH_GMV_FROM_GAMING_AUDIT",
  "HIGH_GMV_FROM_GAMING_FREEZE",
  "HIGH_GMV_FROM_GAMING_BAN",
  "MERCHANT_HARASSMENT",
  "MERCHANT_HIGH_CANCEL_ORDER_RATE",
  "VIOLATION_OF_POLICY_TIER",
  "BRANDED_PRODUCT_GEOBLOCK",
  "POLICY_TIER_DEMOTION",
];

const WARNING_REASONS_OTHER: ReadonlyArray<MerchantWarningReason> = [
  "SUSPECTED_FRAUD",
  "PRODUCT_IS_INAPPROPRIATE",
  "FINAL_JUDGEMENT_ORDER",
  "FAKE_RATING",
];

export enum ReasonCategory {
  inappropriateCS = "inappropriateCS",
  ipInfringement = "ipInfringement",
  account = "account",
  order = "order",
  product = "product",
  store = "store",
  other = "other",
}

export const reasonCategoryMap: Record<
  ReasonCategory,
  ReadonlyArray<MerchantWarningReason>
> = {
  [ReasonCategory.inappropriateCS]: WARNING_REASONS_INAPPROPRIATE_CS,
  [ReasonCategory.ipInfringement]: WARNING_REASONS_IP_INFRINGEMENT,
  [ReasonCategory.account]: WARNING_REASONS_ACCOUNT,
  [ReasonCategory.order]: WARNING_REASONS_ORDERS,
  [ReasonCategory.product]: WARNING_REASONS_PRODUCT,
  [ReasonCategory.store]: WARNING_REASONS_STORE,
  [ReasonCategory.other]: WARNING_REASONS_OTHER,
};
