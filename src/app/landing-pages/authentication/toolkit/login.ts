import gql from "graphql-tag";
import { LoginMutation, AuthenticationMutationsLoginArgs } from "@schema";

export const LOGIN_MUTATION = gql`
  mutation Authentication_LoginMutation($input: LoginMutationInput!) {
    authentication {
      login(input: $input) {
        loginOk
        error
        errorState
        obfuscatedPhoneNumber
        sessionKey
        preferQr
        wechatBound
      }
    }
  }
`;

export type LoginResponseType = {
  readonly authentication?: {
    readonly login?: Pick<
      LoginMutation,
      | "loginOk"
      | "error"
      | "errorState"
      | "obfuscatedPhoneNumber"
      | "sessionKey"
      | "preferQr"
      | "wechatBound"
    > | null;
  } | null;
};

export type LoginRequestType = AuthenticationMutationsLoginArgs;
