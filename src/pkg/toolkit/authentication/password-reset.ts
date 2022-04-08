import gql from "graphql-tag";
import {
  ResetPasswordMutation,
  AuthenticationMutationsResetPasswordArgs,
} from "@schema/types";

export const PASSWORD_RESET_MUTATION = gql`
  mutation Authentication_PasswordResetMutation(
    $input: ResetPasswordMutationInput!
  ) {
    authentication {
      resetPassword(input: $input) {
        error
        ok
      }
    }
  }
`;

export type PasswordResetResponseType = {
  readonly authentication: {
    readonly resetPassword?: Pick<ResetPasswordMutation, "ok" | "error">;
  };
};

export type PasswordResetRequestType = AuthenticationMutationsResetPasswordArgs;
