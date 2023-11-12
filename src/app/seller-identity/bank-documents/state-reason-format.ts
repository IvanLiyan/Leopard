import { ci18n } from "@core/toolkit/i18n";

export type RejectReasonMap = {
  MISMATCH_LAST_FOUR_DIGITS: string;
  PARTIAL_IMAGE: string;
  BLURRY_IMAGE: string;
  UNQUALIFIED_BANK_DOCUMENT: string;
  APPROVE: string;
  INVALID_DOCUMENT: string;
};

export const formatSingleRejectReason = (
  originalReason: keyof RejectReasonMap | null | undefined,
) => {
  const formatMap = {
    MISMATCH_LAST_FOUR_DIGITS: ci18n(
      "reject reason of bank verification",
      "Mismatch last four digits",
    ),
    PARTIAL_IMAGE: ci18n("reject reason of bank verification", "Partial image"),
    BLURRY_IMAGE: ci18n("reject reason of bank verification", "Blurry image"),
    UNQUALIFIED_BANK_DOCUMENT: ci18n(
      "reject reason of bank verification",
      "Unqualified bank document",
    ),
    APPROVE: ci18n("reject reason of bank verification", "Approve"),
    INVALID_DOCUMENT: ci18n(
      "reject reason of bank verification",
      "Invalid document",
    ),
  };
  if (originalReason) return formatMap[originalReason];
};
