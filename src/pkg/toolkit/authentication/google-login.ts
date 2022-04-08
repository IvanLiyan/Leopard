import gql from "graphql-tag";
import { GoogleLoginDetails } from "@schema/types";

export const GOOGLE_LOGIN_QUERY = gql`
  query Authentication_GoogleLoginMutation {
    platformConstants {
      googleLogin {
        authUrl
      }
    }
  }
`;

export type GoogleLoginResponseType = {
  readonly platformConstants: {
    readonly googleLogin?: Pick<GoogleLoginDetails, "authUrl">;
  };
};
