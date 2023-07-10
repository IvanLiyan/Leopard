import { gql } from "@apollo/client";
import { UpsertMerchantWarning, UpsertMerchantWarningInput } from "@schema";

export const SUBMIT_DISPUTE_MUTATION = gql`
  mutation SubmitDisputeMutation(
    $action: MerchantWarningAction!
    $infractionId: ObjectIdType
    $disputeInput: DisputeInfractionInput!
  ) {
    policy {
      merchantWarning {
        upsertMerchantWarning(
          input: {
            action: $action
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

export type SubmitDisputeMutationResponse = {
  readonly policy?: {
    readonly merchantWarning?: {
      readonly upsertMerchantWarning?: Pick<
        UpsertMerchantWarning,
        "ok" | "message"
      >;
    };
  };
};

export type SubmitDisputeMutationVariables = {
  readonly action: Extract<
    UpsertMerchantWarningInput["action"],
    "MERCHANT_LEVEL_DISPUTE" | "LISTING_LEVEL_DISPUTE"
  >;
  readonly infractionId: NonNullable<UpsertMerchantWarningInput["warningId"]>;
  readonly disputeInput: NonNullable<
    UpsertMerchantWarningInput["disputeInput"]
  >;
};
