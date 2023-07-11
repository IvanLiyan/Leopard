import { SellerVerificationSchema } from "@schema";
import { gql } from "@gql";

export const GET_SPV_STATUS_QUERY = gql(`
  query MerchantOnboarding_GetSellerVerificationStatus {
    currentMerchant {
      sellerVerification {
        status
      }
    }
  }
`);

export type GetSPVStatusResponse = {
  readonly currentMerchant?: {
    readonly sellerVerification: Pick<SellerVerificationSchema, "status">;
  } | null;
};
