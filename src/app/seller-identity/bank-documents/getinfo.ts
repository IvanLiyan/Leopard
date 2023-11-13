import { gql } from "@gql";
import { BankAccountVerificationSchema } from "@schema";

export const GET_MERCHANT_BANK_VERIFICATION_STATE_REASON = gql(`
  query getMerchantBankVerificationStateReason {
    currentMerchant {
      bankAccountVerification {
        state
        stateReason
      }
    }
  }
`);

export type BankStatusResponseData = {
  readonly currentMerchant: {
    readonly bankAccountVerification: Pick<
      BankAccountVerificationSchema,
      "state" | "stateReason"
    >;
  };
};
