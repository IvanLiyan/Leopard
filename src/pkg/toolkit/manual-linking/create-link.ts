import gql from "graphql-tag";

/* Types */
import {
  ManualLinkAuthenticationMutation,
  ManualLinkVerificationMutation,
  MerchantEntityManualLinkMutationsCompleteManualLinkArgs,
  MerchantEntityManualLinkMutationsRequestManualLinkArgs,
} from "@schema/types";

export type CreateLinkStep = "AUTHENTICATE" | "VERIFY";

export type RequestManualLinkRequestType =
  MerchantEntityManualLinkMutationsRequestManualLinkArgs;

export type RequestManualLinkResponseType = {
  readonly currentUser?: {
    readonly manualLinkEntity: {
      readonly requestManualLink?: Pick<
        ManualLinkAuthenticationMutation,
        "ok" | "message" | "obfuscatedPhoneNumber" | "supportVerificationCode"
      > | null;
    };
  } | null;
};

export type CompleteManualLinkRequestType =
  MerchantEntityManualLinkMutationsCompleteManualLinkArgs;

export type CompleteManualLinkResponseType = {
  readonly currentUser?: {
    readonly manualLinkEntity: {
      readonly completeManualLink?: Pick<
        ManualLinkVerificationMutation,
        "ok" | "message"
      > | null;
    };
  } | null;
};

export const REQUEST_MANUAL_LINK_MUTATION = gql`
  mutation ManualLink_RequestManualLinkMutation(
    $input: ManualLinkAuthentication!
  ) {
    currentUser {
      manualLinkEntity {
        requestManualLink(input: $input) {
          ok
          message
          obfuscatedPhoneNumber
          supportVerificationCode
        }
      }
    }
  }
`;

export const COMPLETE_MANUAL_LINK_MUTATION = gql`
  mutation ManualLink_CompleteManualLinkMutation(
    $input: ManualLinkVerification!
  ) {
    currentUser {
      manualLinkEntity {
        completeManualLink(input: $input) {
          ok
          message
        }
      }
    }
  }
`;
