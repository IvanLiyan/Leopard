import { gql } from "@apollo/client";
import { Country } from "@schema";

export const ELIGIBLE_COUNTRIES_QUERY = gql`
  query EligibleCountriesQuery {
    currentMerchant {
      shippingSettings {
        country {
          code
          name
        }
      }
    }
  }
`;

export type EligibleCountriesQueryResponse = {
  readonly currentMerchant?: {
    readonly shippingSettings?: ReadonlyArray<{
      readonly country: Pick<Country, "code" | "name">;
    }>;
  };
};
