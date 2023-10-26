import { gql } from "@gql";

/* Types Imports */
import { AcceptMerchantPolicy, AcceptMerchantPolicyInput } from "@schema";

export const ACCEPT_MERCHANT_POLICY_MUTATION = gql(`
  mutation SellerIdentity_AcceptMerchantPolicy(
    $input: AcceptMerchantPolicyInput!
  ) {
    currentMerchant {
      merchantTermsAgreed {
        acceptMerchantPolicy(input: $input) {
          ok
          message
        }
      }
    }
  }
`);

export type AcceptMerchantPolicyResponseType = {
  readonly currentMerchant?: {
    readonly merchantTermsAgreed: {
      readonly acceptMerchantPolicy: Pick<
        AcceptMerchantPolicy,
        "ok" | "message"
      >;
    };
  } | null;
};

export type AcceptMerchantPolicyRequestType = AcceptMerchantPolicyInput;

export type MerchantTermsAgreedMutationsAcceptMerchantPolicyArgs = {
  input: AcceptMerchantPolicyInput;
};
