import { MerchantWarningReason, CounterfeitReason } from "@schema";
import { InfractionQueryResponse } from "./api/infractionQuery";
import { DisputeStatus } from "./copy";

export type DisputeFlow =
  | "ORDER"
  | "MERCHANT"
  | "BRANDED_PRODUCT_GEOBLOCK"
  | "COUNTERFEIT"
  | "INAPPROPRIATE_CONTENT"
  | "MISLEADING_LISTING";

/**
    Returns the DisputeFlow used by an infraction

    @param reason - the infraction's reason / type
    @param counterfeitViolationReason - if the infraction is of type PRODUCT_IS_INAPPROPRIATE, the counterfeit violation reason as identified by taggers
    @param inappropriateViolationReason - if the infraction is of type PRODUCT_IS_INAPPROPRIATE, the inappropriate violation reason as identified by taggers

    @returns the DisputeFlow to be used by the infraction. Type LEGACY should redirect to the old dispute flow, all other types are part of the new infraction dispute flow
 */
export const getDisputeFlow: {
  readonly [reason in MerchantWarningReason]: (
    counterfeitViolationReason: CounterfeitReason | undefined,
    inappropriateViolationReason: CounterfeitReason | undefined,
  ) => DisputeFlow;
} = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  REQUEST_USER_EMAIL: (_, __) => "MERCHANT",
  REQUEST_MONEY: (_, __) => "MERCHANT",
  BAD_CUSTOMER_SERVICE: (_, __) => "MERCHANT",
  DISINGENUOUS_CUSTOMER_SERVICE: (_, __) => "MERCHANT",
  TAKE_USER_OUTSIDE_WISH: (_, __) => "MERCHANT",
  VIOLATE_POLICY: (_, __) => "MERCHANT",
  SUSPECTED_FRAUD: (_, __) => "MERCHANT",
  REPEAT_IP_INFRINGEMENT_ON_BRAND_OWNER: (_, __) => "MERCHANT",
  MERCHANT_CONTACT_INFO_INVALID: (_, __) => "MERCHANT",
  RESPOND_TO_ADMIN: (_, __) => "MERCHANT",
  WISHPOST_NEGATIVE_BALANCE: (_, __) => "MERCHANT",
  HIGH_IP_INFRINGEMENT: (_, __) => "MERCHANT",
  VIOLATE_TS_POLICY: (_, __) => "MERCHANT",
  BAN_EARLY_STAGE_MERCHANT: (_, __) => "MERCHANT",
  INACTIVE_ACCOUNT: (_, __) => "MERCHANT",
  FINE_PRODUCT_SWAPPED: (_, __) => "MERCHANT",

  FINE_FOR_COUNTERFEIT_GOODS: (_, __) => "COUNTERFEIT",
  LEGAL_TRO_TAKEDOWN: (_, __) => "COUNTERFEIT",

  CN_PROHIBITED_PRODUCTS: (_, __) => "INAPPROPRIATE_CONTENT",
  PRODUCT_IS_INAPPROPRIATE: (
    counterfeitViolationReason,
    inappropriateViolationReason,
  ) =>
    counterfeitViolationReason === "MISLEADING_LISTING" ||
    inappropriateViolationReason === "MISLEADING_LISTING"
      ? "MISLEADING_LISTING"
      : "INAPPROPRIATE_CONTENT",

  BRANDED_PRODUCT_GEOBLOCK: (_, __) => "BRANDED_PRODUCT_GEOBLOCK",

  FAKE_TRACKING: (_, __) => "ORDER",
  MERCHANT_CANCELLATION_VIOLATION: (_, __) => "ORDER",
  LATE_CONFIRMED_FULFILLMENT_VIOLATION: (_, __) => "ORDER",
  UNFULFILLED_ORDER: (_, __) => "ORDER",
  FINE_WISH_EXPRESS_POLICY_VIOLATION: (_, __) => "ORDER",
  WAREHOUSE_FULFILLMENT_POLICY_VIOLATION: (_, __) => "ORDER",
  ORDER_NOT_DELIVERED: (_, __) => "ORDER",

  INVALID_TRACKING_NUMBERS: (_, __) => "MERCHANT",
  HIGH_CHARGEBACK_RATIO: (_, __) => "MERCHANT",
  PRODUCT_HIGH_REFUND_RATIO: (_, __) => "MERCHANT",
  DUPLICATE_PRODUCTS: (_, __) => "MERCHANT",
  HIGH_GMV_FROM_GAMING_AUDIT: (_, __) => "MERCHANT",
  INVALID_EU_RESPONSIBLE_PERSON: (_, __) => "MERCHANT",
  FAKE_RATING: (_, __) => "MERCHANT",
  DEP_BAIT_VARIABLE_PRICING: (_, __) => "MERCHANT",
  DUPLICATE_ACCOUNTS: (_, __) => "MERCHANT",
  EXTREMELY_HIGH_PRICE_SPREAD: (_, __) => "MERCHANT",
  HIGH_GMV_FROM_GAMING_BAN: (_, __) => "MERCHANT",
  HIGH_CHARGEBACK_AND_FRAUD_REFUND_RATIO: (_, __) => "MERCHANT",
  PRODUCT_LOW_RATING: (_, __) => "MERCHANT",
  FINE_UPDATE_TO_COUNTERFEIT: (_, __) => "MERCHANT",
  WISH_STANDARDS_BAN: (_, __) => "MERCHANT",
  RELATED_ACCOUNT_IS_BANNED: (_, __) => "MERCHANT",
  DEP_FINE_DISABLE_PROMOTED_PRODUCT_FOR_COUNTRY: (_, __) => "MERCHANT",
  HIGH_GMV_FROM_GAMING_FREEZE: (_, __) => "MERCHANT",
  WISH_EXPRESS_POLICY_MERCHANT: (_, __) => "MERCHANT",
  EMPTY_PACKAGES: (_, __) => "MERCHANT",
  VIOLATION_OF_POLICY_TIER: (_, __) => "MERCHANT",
  CS_LATE_RESPONSE_RATE: (_, __) => "MERCHANT",
  WISH_EXPRESS_POLICY_VIOLATION: (_, __) => "MERCHANT",
  HIGH_AUTO_REFUND: (_, __) => "MERCHANT",
  MERCHANT_HIGH_CANCEL_ORDER_RATE: (_, __) => "MERCHANT",
  WISH_EXPRESS_POLICY_PRODUCT: (_, __) => "MERCHANT",
  PRODUCT_HIGH_QUALITY_REFUND_RATIO: (_, __) => "MERCHANT",
  MISLEADING_VARIATION: (_, __) => "MERCHANT",
  MERCHANT_HIGH_REFUND_EAT_COST: (_, __) => "MERCHANT",
  PRODUCT_GEOBLOCK: (_, __) => "MERCHANT",
  DEP_FINE_DISABLE_PROMOTED_PRODUCT: (_, __) => "MERCHANT",
  UNCONFIRMED_TRACKING_NUMBERS: (_, __) => "MERCHANT",
  PRODUCT_HIGH_REFUND_RATIO_NO_REMOVE: (_, __) => "MERCHANT",
  US_TAX_INFO_UNVALIDATED: (_, __) => "MERCHANT",
  STRIKE_BASED_HIGH_RISK_PROHIBITED: (_, __) => "MERCHANT",
  PENALTY_FOR_AUTO_REFUND: (_, __) => "MERCHANT",
  FINAL_JUDGEMENT_ORDER: (_, __) => "MERCHANT",
  CONFIRMED_DELIVERY_POLICY: (_, __) => "MERCHANT",
  HIGH_REFUND_RATIO: (_, __) => "MERCHANT",
  POLICY_TIER_DEMOTION: (_, __) => "MERCHANT",
  MERCHANT_HIGH_QUALITY_REFUND_RATIO: (_, __) => "MERCHANT",
  REPEAT_PRODUCT_SWAPPING: (_, __) => "MERCHANT",
  WISHPOST_ID_NOT_COMPLETE_FACE_RECOGNITION: (_, __) => "MERCHANT",
  HIGH_GMV_FROM_MISLEADING_PRODUCTS: (_, __) => "MERCHANT",
  PRODUCT_HIGH_CANCEL_ORDER_RATE: (_, __) => "MERCHANT",
  COUNTERFEIT_GOODS: (_, __) => "MERCHANT",
  CS_LOW_CSAT_SCORE: (_, __) => "MERCHANT",
  LATE_FULFILLMENT_RATE: (_, __) => "MERCHANT",
  DECEPTIVE_FULFILLMENT: (_, __) => "MERCHANT",
  VIOLATION_OF_TERMS: (_, __) => "MERCHANT",
  STORE_VALIDATION_INCOMPLETE: (_, __) => "MERCHANT",
  TAX_SETTING_NOT_UPDATED: (_, __) => "MERCHANT",
  MERCHANT_HARASSMENT: (_, __) => "MERCHANT",
  REUPLOADING_COUNTERFEITS: (_, __) => "MERCHANT",
  PRODUCT_LOW_RATING_NO_REMOVE: (_, __) => "MERCHANT",
  /* eslint-enable @typescript-eslint/no-unused-vars */
};

/**
    Calculates the dispute status

    @param infraction - the infraction returned by GQL

    @returns the DisputeStatus for the infraction's dispute (if one exists)
 */
export const getDisputeStatus = (
  infraction: NonNullable<
    NonNullable<InfractionQueryResponse["policy"]>["merchantWarning"]
  >,
): DisputeStatus => {
  if (
    infraction.proofs.some(({ disputeStatus }) => {
      disputeStatus === "DISPUTE_FAILED";
    })
  ) {
    return "DISPUTE_FAILED";
  }

  if (
    infraction.proofs.some(({ disputeStatus }) => {
      disputeStatus === "DISPUTE_SUCCESS";
    })
  ) {
    return "DISPUTE_SUCCESS";
  }

  if (infraction.resolved && infraction.state === "CLOSED") {
    return "DISPUTE_SUCCESS";
  }

  if (
    infraction.proofs.some(({ disputeStatus }) => {
      disputeStatus === "DISPUTING";
    })
  ) {
    return "DISPUTING";
  }

  if (
    infraction.proofs.every(({ disputeStatus }) => {
      disputeStatus === "NOT_DISPUTED";
    })
  ) {
    return "NOT_DISPUTED";
  }

  return infraction.trackingDispute != null
    ? infraction.trackingDispute.state
    : infraction.proofs.length > 0
    ? infraction.proofs[0].disputeStatus
    : "NOT_DISPUTED";
};
