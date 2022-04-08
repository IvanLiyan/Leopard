import gql from "graphql-tag";

/* Types */
import {
  ManualLinkDeletionMutation,
  MerchantEntityManualLinkMutationsDeleteManualLinkArgs,
} from "@schema/types";

export type DeleteManualLinkRequestType =
  MerchantEntityManualLinkMutationsDeleteManualLinkArgs;

export type DeleteManualLinkResponseType = {
  readonly currentUser?: {
    readonly manualLinkEntity: {
      readonly deleteManualLink?: Pick<
        ManualLinkDeletionMutation,
        "ok" | "message"
      > | null;
    };
  } | null;
};

export const DELETE_MANUAL_LINK_MUTATION = gql`
  mutation ManualLink_DeleteManualLinkMutation($input: ManualLinkDeletion!) {
    currentUser {
      manualLinkEntity {
        deleteManualLink(input: $input) {
          ok
          message
        }
      }
    }
  }
`;
