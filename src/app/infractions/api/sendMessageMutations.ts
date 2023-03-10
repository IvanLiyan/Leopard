import { gql } from "@apollo/client";
import {
  UpsertMerchantWarning,
  UpsertMerchantWarningInput,
  UpsertOrderInfractionDispute,
  UpsertOrderInfractionDisputeInput,
} from "@schema";

export const SEND_MESSAGE_MUTATION = gql`
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
`;

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

export const SEND_ORDER_INFRACTION_MESSAGE_MUTATION = gql`
  mutation InfractionDisputeState_OrderInfractionDisputeMutation(
    $infractionId: ObjectIdType
    $disputeId: ObjectIdType
    $message: String!
  ) {
    policy {
      orderInfractionDispute {
        upsertOrderInfractionDispute(
          input: {
            action: REPLY
            warningId: $infractionId
            message: $message
            id: $disputeId
          }
        ) {
          ok
          message
        }
      }
    }
  }
`;

export type SendOrderInfractionMessageMutationResponse = {
  readonly policy?: {
    readonly orderInfractionDispute?: {
      readonly upsertOrderInfractionDispute?: Pick<
        UpsertOrderInfractionDispute,
        "ok" | "message"
      >;
    };
  };
};

export type SendOrderInfractionMessageMutationVariables = {
  readonly infractionId: UpsertOrderInfractionDisputeInput["warningId"];
  readonly disputeId: UpsertOrderInfractionDisputeInput["id"];
  readonly message: UpsertOrderInfractionDisputeInput["message"];
};
