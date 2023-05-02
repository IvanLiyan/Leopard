import { gql } from "@apollo/client";
import { Country, ProductComplianceSchema } from "@schema";

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
        readonly countries: ReadonlyArray<{
          readonly country: Pick<Country, "name" | "code">;
          readonly isMerchantAuthorized: boolean;
          readonly categoriesWithEpr: number;
          readonly categoriesWithoutEpr: number;
        }>;
      };
    };
  };
};

export const dataMock: PccQueryResponse = {
  policy: {
    productCompliance: {
      productsWithEuResponsiblePerson: 188294,
      productsWithoutEuResponsiblePerson: 4758,
      extendedProducerResponsibility: {
        countries: [
          {
            country: {
              name: "France",
              code: "FR",
            },
            isMerchantAuthorized: true,
            categoriesWithEpr: 8,
            categoriesWithoutEpr: 4,
          },
          {
            country: {
              name: "Germany",
              code: "DE",
            },
            isMerchantAuthorized: false,
            categoriesWithEpr: 0,
            categoriesWithoutEpr: 12,
          },
        ],
      },
    },
  },
};
