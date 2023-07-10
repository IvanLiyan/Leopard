import gql from "graphql-tag";
import {
  TwoFactorGenTokenMutation,
  AuthenticationMutationsGen2faCodeArgs,
} from "@schema";

export const TWO_FACTOR_GEN_TOKEN_MUTATION = gql`
  mutation Authentication_TwoFactorGenTokenMutation(
    $input: TwoFactorGenTokenInput!
  ) {
    authentication {
      gen2faCode(input: $input) {
        obfuscatedPhoneNumber
        allowTfaPhone
        isMerchant
        bdEmail
        isInternalEmployee
        ok
        error
      }
    }
  }
`;

export type TwoFactorGenTokenResponseType = {
  readonly authentication?: {
    readonly gen2faCode?: Pick<
      TwoFactorGenTokenMutation,
      | "obfuscatedPhoneNumber"
      | "allowTfaPhone"
      | "isMerchant"
      | "bdEmail"
      | "isInternalEmployee"
      | "ok"
      | "error"
    > | null;
  } | null;
};

export type TwoFactorGenTokenRequestType =
  AuthenticationMutationsGen2faCodeArgs;
