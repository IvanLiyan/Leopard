import { gql } from "@apollo/client";

export const EPR_QUERY = gql`
  query ExtendedProducerResponsibilityPageQuery($countryCode: CountryCode!) {
    policy {
      productCompliance {
        extendedProducerResponsibility {
          country(countryCode: $countryCode) {
            isMerchantAuthorized
            categories {
              id
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

// will be replaced with type from schema once GQL is merged
export type EprStatus =
  | "DELETED"
  | "ADMIN_APPROVED"
  | "COMPLETE"
  | "REJECTED"
  | "IN_REVIEW";

export type EprQueryResponse = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly extendedProducerResponsibility: {
        readonly country: {
          readonly isMerchantAuthorized: boolean;
          readonly categories: ReadonlyArray<{
            readonly id: Maybe<string>;
            readonly category: number;
            readonly categoryName: string;
            readonly uin: Maybe<string>;
            readonly responsibleEntityName: Maybe<string>;
            readonly status: Maybe<EprStatus>;
          }>;
        };
      };
    };
  };
};

export const dataMock: EprQueryResponse = {
  policy: {
    productCompliance: {
      extendedProducerResponsibility: {
        country: {
          isMerchantAuthorized: true,
          categories: [
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Electrical and Electronic Equipment",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Batteries",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "IN_REVIEW",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Printed Paper",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "REJECTED",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Packaging",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "DELETED",
            },
            {
              id: undefined,
              category: 1,
              categoryName:
                "Mineral or synthetic lubricating or industrial oils",
              uin: undefined,
              responsibleEntityName: undefined,
              status: undefined,
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Electrical and Electronic Equipment",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Electrical and Electronic Equipment",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Electrical and Electronic Equipment",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Electrical and Electronic Equipment",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Electrical and Electronic Equipment",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Electrical and Electronic Equipment",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Packaging",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Packaging",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Packaging",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Packaging",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Packaging",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
            {
              id: "9A1738DC19A3",
              category: 1,
              categoryName: "Packaging",
              uin: "1234-5678-8213",
              responsibleEntityName: "Corepile",
              status: "COMPLETE",
            },
          ],
        },
      },
    },
  },
};
