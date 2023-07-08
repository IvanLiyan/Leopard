import { gql } from "@gql";
import {
  AcceptTos,
  AcceptTosInput,
  CountryEprSchema,
  ExtendedProducerResponsibilitySchemaCountryArgs,
} from "@schema";

export const TOS_QUERY = gql(`
  query TosModalQuery($countryCode: CountryCode!) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          country(countryCode: $countryCode) {
            tos
          }
        }
      }
    }
  }
`);

export type TosQueryResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly country: Pick<CountryEprSchema, "tos">;
      };
    };
  };
};

export type TosQueryVariables = ExtendedProducerResponsibilitySchemaCountryArgs;

export const ACCEPT_TOS_MUTATION = gql(`
  mutation AcceptTosMutation($input: AcceptTosInput!) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          acceptTos(input: $input) {
            ok
            message
          }
        }
      }
    }
  }
`);

export type AcceptTosMutationResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly acceptTos: Pick<AcceptTos, "ok" | "message">;
      };
    };
  };
};

export type AcceptTosMutationVariables = { input: AcceptTosInput };
