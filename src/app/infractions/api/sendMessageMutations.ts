import { gql } from "@gql";
import { UpsertMerchantWarning, UpsertMerchantWarningInput } from "@schema";

export const SEND_MESSAGE_MUTATION = gql(`
  mutation SendMessageMutation(
    $infractionId: ObjectIdType
    $messageInput: ReplyInfractionInput!
  ) {
    policy {
      merchantWarning {
        upsertMerchantWarning(
          input: {
            action: REPLY
            warningId: $infractionId
            messageInput: $messageInput
          }
        ) {
          ok
          message
        }
      }
    }
  }
`);

export type SendMessageMutationResponse = {
  readonly policy?: {
    readonly merchantWarning?: {
      readonly upsertMerchantWarning?: Pick<
        UpsertMerchantWarning,
        "ok" | "message"
      >;
    };
  };
};

export type SendMessageMutationVariables = {
  readonly infractionId: NonNullable<UpsertMerchantWarningInput["warningId"]>;
  readonly messageInput: NonNullable<
    UpsertMerchantWarningInput["messageInput"]
  >;
};
