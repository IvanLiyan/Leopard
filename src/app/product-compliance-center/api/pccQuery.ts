import { gql } from "@apollo/client";
import { Country, CountryEprSchema, ProductComplianceSchema } from "@schema";

export const PCC_QUERY = gql`
  query ProductComplianceCenterQuery {
    policy {
      productCompliance {
        productsWithEuResponsiblePerson: linkCount(
          complianceTypes: [EU_COMPLIANCE]
          states: [HAS_RP]
        )
        productsWithoutEuResponsiblePerson: linkCount(
          complianceTypes: [EU_COMPLIANCE]
          states: [NO_RP]
        )
        extendedProducerResponsibility {
          countries {
            country {
              name
              code
            }
            isMerchantAuthorized
            categoriesWithEpr
            categoriesWithoutEpr
          }
        }
      }
    }
  }
`;

export type PccQueryResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly productsWithEuResponsiblePerson: ProductComplianceSchema["linkCount"];
      readonly productsWithoutEuResponsiblePerson: ProductComplianceSchema["linkCount"];
      readonly extendedProducerResponsibility: {
        readonly countries: ReadonlyArray<
          {
            readonly country: Pick<Country, "name" | "code">;
          } & Pick<
            CountryEprSchema,
            | "isMerchantAuthorized"
            | "categoriesWithEpr"
            | "categoriesWithoutEpr"
          >
        >;
      };
    };
  };
};
