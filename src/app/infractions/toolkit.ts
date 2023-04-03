import {
  MerchantWarningReason,
  CounterfeitReason,
  TaggingViolationSubReasonCode,
} from "@schema";
import { InfractionQueryResponse } from "./api/infractionQuery";
import { DisputeStatus } from "./copy";

export type DisputeFlow =
  | "LEGACY"
  | "MERCHANT"
  | "BRANDED_PRODUCT_GEOBLOCK"
  | "COUNTERFEIT"
  | "INAPPROPRIATE_CONTENT"
  | "MISLEADING_LISTING";

/**
    Returns the DisputeFlow used by an infraction

    @param reason - the infraction's reason / type
    @param inappropriateReason - if the infraction is of type PRODUCT_IS_INAPPROPRIATE, the primary reason as identified by taggers
    @param inappropriateSubreason - if the infraction is of type PRODUCT_IS_INAPPROPRIATE, the subreason as identified by taggers

    @returns the DisputeFlow to be used by the infraction. Type LEGACY should redirect to the old dispute flow, all other types are part of the new infraction dispute flow
 */
export const getDisputeFlow = (
  reason: MerchantWarningReason,
  inappropriateReason: CounterfeitReason | undefined,
  inappropriateSubreason: TaggingViolationSubReasonCode | undefined,
): DisputeFlow => {
  // will be used in future dispute flows
  void inappropriateSubreason;

  if (
    reason === "REQUEST_USER_EMAIL" ||
    reason === "REQUEST_MONEY" ||
    reason === "BAD_CUSTOMER_SERVICE" ||
    reason === "DISINGENUOUS_CUSTOMER_SERVICE" ||
    reason === "TAKE_USER_OUTSIDE_WISH" ||
    reason === "VIOLATE_POLICY" ||
    reason === "SUSPECTED_FRAUD" ||
    reason === "REPEAT_IP_INFRINGEMENT_ON_BRAND_OWNER" ||
    reason === "MERCHANT_CONTACT_INFO_INVALID" ||
    reason === "RESPOND_TO_ADMIN" ||
    reason === "WISHPOST_NEGATIVE_BALANCE" ||
    reason === "HIGH_IP_INFRINGEMENT" ||
    reason === "VIOLATE_TS_POLICY" ||
    reason === "BAN_EARLY_STAGE_MERCHANT" ||
    reason === "INACTIVE_ACCOUNT" ||
    reason === "FINE_PRODUCT_SWAPPED"
  ) {
    return "MERCHANT";
  }

  if (
    reason === "FINE_FOR_COUNTERFEIT_GOODS" ||
    reason === "LEGAL_TRO_TAKEDOWN"
  ) {
    return "COUNTERFEIT";
  }

  if (
    reason === "PRODUCT_IS_INAPPROPRIATE" &&
    inappropriateReason === "MISLEADING_LISTING"
  ) {
    return "MISLEADING_LISTING";
  }

  if (
    reason === "PRODUCT_IS_INAPPROPRIATE" ||
    reason === "CN_PROHIBITED_PRODUCTS"
  ) {
    return "INAPPROPRIATE_CONTENT";
  }

  if (reason === "BRANDED_PRODUCT_GEOBLOCK") {
    return "BRANDED_PRODUCT_GEOBLOCK";
  }

  return "LEGACY";
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
