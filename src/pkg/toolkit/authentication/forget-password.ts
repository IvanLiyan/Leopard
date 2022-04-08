import gql from "graphql-tag";
import {
  NotifyPasswordRecoveryMutation,
  AuthenticationMutationsNotifyPasswordRecoveryArgs,
} from "@schema/types";

export const FORGET_PASSWORD_MUTATION = gql`
  mutation Authentication_ForgetPasswordMutation(
    $input: NotifyPasswordRecoveryMutationInput!
  ) {
    authentication {
      notifyPasswordRecovery(input: $input) {
        error
        ok
      }
    }
  }
`;

export type ForgetPasswordResponseType = {
  readonly authentication: {
    readonly notifyPasswordRecovery?: Pick<
      NotifyPasswordRecoveryMutation,
      "ok" | "error"
    >;
  };
};

export type ForgetPasswordRequestType =
  AuthenticationMutationsNotifyPasswordRecoveryArgs;
