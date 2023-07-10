import gql from "graphql-tag";
import { PlatformConstants } from "@schema";

export const OKTA_OAUTH_URL_QUERY = gql`
  query Authentication_Okta_Url_Query {
    platformConstants {
      oktaOauthUri
    }
  }
`;

export type OktaUrlQueryResponseType = {
  readonly platformConstants?: Pick<PlatformConstants, "oktaOauthUri"> | null;
};
