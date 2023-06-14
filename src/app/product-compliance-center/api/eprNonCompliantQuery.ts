import { gql } from "@apollo/client";
import {
  Country,
  EprNonCompliantSummarySchema,
  EprNonCompliantSummaryRecordSchema,
  EprProductRecordSchema,
  EprNonCompliantSummarySchemaProductRecordsArgs,
} from "@schema";

export const EPR_NON_COMPLIANT_SUMMARY_QUERY = gql`
  query EprNonCompliantSummaryQuery {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          eprNonCompliantSummary {
            summaryRecords {
              country {
                name
                code
              }
              eprCategoryName
              nonCompliantProductCount
            }
          }
        }
      }
    }
  }
`;

export type EprNonCompliantSummaryQueryResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly eprNonCompliantSummary: {
          readonly summaryRecords: ReadonlyArray<
            { readonly country: Pick<Country, "name" | "code"> } & Pick<
              EprNonCompliantSummaryRecordSchema,
              "eprCategoryName" | "nonCompliantProductCount"
            >
          >;
        };
      };
    };
  };
};

export const EPR_NON_COMPLIANT_PRODUCTS_QUERY = gql`
  query EprNonCompliantProductsQuery(
    $countryCode: CountryCode!
    $eprCategories: [Int!]
    $productId: String
    $offset: Int
    $limit: Int
  ) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          eprNonCompliantSummary {
            productRecordTotal(
              countryCode: $countryCode
              eprCategories: $eprCategories
              productId: $productId
            )
            productRecords(
              countryCode: $countryCode
              eprCategories: $eprCategories
              productId: $productId
              offset: $offset
              limit: $limit
            ) {
              productId
              country {
                name
                code
              }
              taxonomyCategoryNames
              eprCategoryNames
            }
          }
        }
      }
    }
  }
`;

export type EprNonCompliantProductsQueryVariables =
  EprNonCompliantSummarySchemaProductRecordsArgs;

export type EprNonCompliantProductsQueryResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly eprNonCompliantSummary: Pick<
          EprNonCompliantSummarySchema,
          "productRecordTotal"
        > & {
          readonly productRecords: ReadonlyArray<
            { readonly country: Pick<Country, "name" | "code"> } & Pick<
              EprProductRecordSchema,
              "productId" | "taxonomyCategoryNames" | "eprCategoryNames"
            >
          >;
        };
      };
    };
  };
};
