import { gql } from "@apollo/client";
import {
  CategoryEprSchema,
  CountryEprSchema,
  ExtendedProducerResponsibilitySchemaCountryArgs,
} from "@schema";

export const EPR_QUERY = gql`
  query ExtendedProducerResponsibilityPageQuery($countryCode: CountryCode!) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          country(countryCode: $countryCode) {
            isMerchantAuthorized
            categories {
              eprId: id # using id as a name breaks Apollo's caching
              category
              categoryName
              uin
              responsibleEntityName
              status
            }
          }
        }
      }
    }
  }
`;

export type EprQueryResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly country: Pick<CountryEprSchema, "isMerchantAuthorized"> & {
          readonly categories: ReadonlyArray<
            Pick<
              CategoryEprSchema,
              | "category"
              | "categoryName"
              | "uin"
              | "responsibleEntityName"
              | "status"
            > & {
              readonly eprId: CategoryEprSchema["id"];
            }
          >;
        };
      };
    };
  };
};

export type EprQueryVariables = ExtendedProducerResponsibilitySchemaCountryArgs;
