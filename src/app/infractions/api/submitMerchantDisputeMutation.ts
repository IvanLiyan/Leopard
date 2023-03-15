import { gql } from "@apollo/client";
import { UpsertMerchantWarning, UpsertMerchantWarningInput } from "@schema";

export const SUBMIT_MERCHANT_DISPUTE_MUTATION = gql`
  mutation SubmitMerchantDisputeMutation(
    $infractionId: ObjectIdType
    $disputeInput: DisputeInfractionInput!
  ) {
    policy {
      merchantWarning {
        upsertMerchantWarning(
          input: {
            action: MERCHANT_LEVEL_DISPUTE
            warningId: $infractionId
            disputeInput: $disputeInput
          }
        ) {
          ok
          message
        }
      }
    }
  }
`;

export type SubmitMerchantDisputeMutationResponse = {
  readonly policy?: {
    readonly merchantWarning?: {
      readonly upsertMerchantWarning?: Pick<
        UpsertMerchantWarning,
        "ok" | "message"
      >;
    };
  };
};

export type SubmitMerchantDisputeMutationVariables = {
  readonly infractionId: NonNullable<UpsertMerchantWarningInput["warningId"]>;
  readonly disputeInput: NonNullable<
    UpsertMerchantWarningInput["disputeInput"]
  >;
};
