import gql from "graphql-tag";

import { AcceptTermsOfService } from "@schema/types";

export const ACCEPT_TERMS_OF_SERVICE_MUTATION = gql`
  mutation AcceptTermsOfServiceComponent_AcceptTermsOfServiceMutation(
    $input: AcceptTermsOfServiceInput!
  ) {
    currentUser {
      merchant {
        merchantTermsAgreed {
          acceptTermsOfService(input: $input) {
            ok
            message
          }
        }
      }
    }
  }
`;

type AcceptTermsOfServiceType = Pick<AcceptTermsOfService, "ok" | "message">;

export type AcceptTermsResponseType = {
  readonly currentUser: {
    readonly merchant: {
      readonly merchantTermsAgreed: {
        readonly acceptTermsOfService: AcceptTermsOfServiceType;
      };
    };
  };
};
