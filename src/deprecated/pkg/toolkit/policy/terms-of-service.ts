import gql from "graphql-tag";

import { wishURL } from "@toolkit/url";

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

export const previousTosUrl = "/terms-of-service?version=4";
export const cnTosUrl = "/terms-of-service?country=CN&version=5";
export const euTosUrl = "/terms-of-service?country=GB&version=5";
export const generalTosUrl = "/terms-of-service?country=NA&version=5";
export const wishPostTosUrl =
  "https://www.wishpost.cn/welcome/#/terms-of-service";
export const partnersTosUrl = "/api-partner-terms-of-service";
export const policyHomeUrl = "/policy/home";
export const taxPolicyUrl = "/tax/policy";
export const policyFeesUrl = "/policy/fees_and_payments";
export const wishPrivacyPolicyUrl = wishURL("/privacy_policy");
export const wishExpressTosUrl = "/policy#wish_express";
export const fbwTosUrl = "/fbw/tos";
export const wishLocalTermsUrl = wishURL("/local/terms");
export const wishLocalInviteTermsUrl = wishURL("/local/invite/en-terms");
export const productBoostTosUrl = "/product-boost/tos";
export const wpsTosUrl = "https://parcel.wish.com/wpstos";
export const wishTermsUrl = wishURL("/terms");
export const merchantNoticesEmail = "mailto:merchant_notices@wish.com";
export const merchantSupportEmail = "mailto:merchant_support@wish.com";
export const returnPolicyUrl = wishURL("/return_policy");
export const productBoostUrl = "/product-boost";
export const eeaLink = "/merchant-payout-service-terms-eea";
export const jamsadrLink = "http://www.jamsadr.com";
export const jamsadrRulesSlLink =
  "http://www.jamsadr.com/rules-streamlined-arbitration/";
export const jamsadrRulesCompLink =
  "http://www.jamsadr.com/rules-comprehensive-arbitration/";
