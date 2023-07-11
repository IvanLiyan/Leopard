import { gql } from "@gql";
import {
  CategoryEprSchema,
  CountryEprSchema,
  ExtendedProducerResponsibilitySchemaCountryArgs,
} from "@schema";

export const EPR_QUERY = gql(`
  query ExtendedProducerResponsibilityPageQuery($countryCode: CountryCode!) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          country(countryCode: $countryCode) {
            hasAcceptedTos
            categories {
              eprId: id # using id as a name breaks Apollo's caching
              category
              categoryName
              uin
              responsibleEntityName
              status
              inScopePidCount
            }
          }
        }
      }
    }
  }
`);

export type EprQueryResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly country: Pick<CountryEprSchema, "hasAcceptedTos"> & {
          readonly categories: ReadonlyArray<
            Pick<
              CategoryEprSchema,
              | "category"
              | "categoryName"
              | "uin"
              | "responsibleEntityName"
              | "status"
              | "inScopePidCount"
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
