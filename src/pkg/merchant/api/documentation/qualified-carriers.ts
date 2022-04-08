import gql from "graphql-tag";

/* Type Imports */
import {
  Country,
  CountryCode,
  ShippingProviderSchema,
  ShippingProviderPolicySchema,
  PublicShippingProviderDocsShippingProviderPoliciesArgs,
  TrackingIdFormatSchema,
} from "@schema/types";

export type PickedCountry = Pick<Country, "code" | "name">;

export type PickedTrackingFormats = Pick<
  TrackingIdFormatSchema,
  "format" | "example"
> & {
  readonly country: PickedCountry;
};

export type PickedShippingProvider = Pick<
  ShippingProviderSchema,
  | "id"
  | "name"
  | "trackingUrl"
  | "providerUrl"
  | "status"
  | "qualifiedNote"
  | "isQualified"
> & {
  readonly originCountry?: PickedCountry;
  readonly trackingFormats?: ReadonlyArray<PickedTrackingFormats>;
  readonly ddpSupportedOriginCountries?: ReadonlyArray<CountryCode>;
};

export type PickedShippingProviderPolicy = Pick<
  ShippingProviderPolicySchema,
  "origin" | "condition" | "allowedProviderType" | "note"
> & {
  readonly destinationCountry?: PickedCountry;
  readonly shippingProviders: ReadonlyArray<PickedShippingProvider>;
  readonly wishpostChannels?: ReadonlyArray<string>;
};

export type GetShippingProviderPoliciesRequestType = PublicShippingProviderDocsShippingProviderPoliciesArgs;

export type GetShippingProviderPoliciesResponseType = {
  readonly publicShippingProviderDocs: {
    readonly shippingProviderPolicies: ReadonlyArray<
      PickedShippingProviderPolicy
    >;
  };
};

export const GET_SHIPPING_PROVIDER_POLICIES = gql`
  query QualifiedCarriers_GetShippingProviderPolicies(
    $destCountryCode: CountryCode!
  ) {
    publicShippingProviderDocs {
      shippingProviderPolicies(destCountryCode: $destCountryCode) {
        destinationCountry {
          code
          name
        }
        origin
        condition
        note
        wishpostChannels
        allowedProviderType
        shippingProviders {
          id
          name
          isQualified
          qualifiedNote
          ddpSupportedOriginCountries
          providerUrl
          status
          trackingUrl
          trackingFormats(destCountryCode: $destCountryCode) {
            country {
              code
              name
            }
            format
            example
          }
        }
      }
    }
  }
`;
