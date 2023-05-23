import { gql } from "@apollo/client";
import { Country, CountryEprSchema, ProductComplianceSchema } from "@schema";

export const PCC_QUERY = gql`
  query ProductComplianceCenterQuery {
    policy {
      productCompliance {
        productsWithEuResponsiblePerson: linkCount(
          categories: [TOYS, ELECTRICAL_PRODUCTS, PPE, ELECTRONICS]
          euComplianceCategories: [
            FOOD
            EEE
            ENVIRONMENT
            OTHER
            CHEMICAL
            COSMETICS
            TOYS
          ]
          states: [HAS_RP]
          complianceTypes: [EU_COMPLIANCE]
        )
        productsWithoutEuResponsiblePerson: linkCount(
          categories: [TOYS, ELECTRICAL_PRODUCTS, PPE, ELECTRONICS]
          euComplianceCategories: [
            FOOD
            EEE
            ENVIRONMENT
            OTHER
            CHEMICAL
            COSMETICS
            TOYS
          ]
          states: [NO_RP]
          complianceTypes: [EU_COMPLIANCE]
        )
        extendedProducerResponsibility {
          countries {
            country {
              name
              code
            }
            categoriesWithEpr
            categoriesWithoutEpr
            hasAcceptedTos
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
            "categoriesWithEpr" | "categoriesWithoutEpr" | "hasAcceptedTos"
          >
        >;
      };
    };
  };
};
