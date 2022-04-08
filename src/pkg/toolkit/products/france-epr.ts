import { useMemo } from "react";
import gql from "graphql-tag";
import {
  FranceProductUniqueIdentificationNumberCategory,
  FranceProductUniqueIdentificationNumberStatus,
  FranceProductUniqueIdentificationNumberSchema,
  LinkProductComplianceSchema,
  ProductSchema,
  ProductComplianceSchemaLinksArgs,
  ProductComplianceSchemaFranceProductUniqueIdentificationNumbersArgs,
  MerchantTermsAgreedSchema,
  ProductComplianceSchemaLinkCountArgs,
} from "@schema/types";
import { Theme } from "@ContextLogic/lego";

export const ORDERED_CATEGORIES: FranceProductUniqueIdentificationNumberCategory[] =
  [
    "PRIMARY_PACKAGING",
    "SECONDARY_PACKAGING",
    "ELECTRIC_AND_ELECTRONIC_EQUIPMENTS",
    "BATTERIES",
    "FURNITURE",
    "TIRES",
    "PAPER",
    "TEXTILE",
  ];

export type PickedFranceUinSchema = Pick<
  FranceProductUniqueIdentificationNumberSchema,
  | "id"
  | "category"
  | "status"
  | "productResponsibilityOrganization"
  | "uniqueIdentificationNumber"
>;

type PickedProduct = Pick<ProductSchema, "id" | "name">;

type PickedProductLink = Pick<
  LinkProductComplianceSchema,
  "reviewState" | "id" | "isLinkedWithFranceUin"
> & {
  readonly product?: PickedProduct | null;
};

export type FranceEprContainerInitialData = {
  readonly currentMerchant: {
    readonly merchantTermsAgreed?: Pick<
      MerchantTermsAgreedSchema,
      "agreedToFrComplianceTos"
    > | null;
  };
  readonly policy?: {
    readonly productCompliance?: {
      readonly franceProductUniqueIdentificationNumbers?: ReadonlyArray<PickedFranceUinSchema> | null;
      readonly primaryPackingUnlinkedCount?: number | null;
      readonly secondaryPackingUnlinkedCount?: number | null;
      readonly eeeUnlinkedCount?: number | null;
      readonly batteriesUnlinkedCount?: number | null;
      readonly furnitureUnlinkedCount?: number | null;
      readonly tiresUnlinkedCount?: number | null;
      readonly paperUnlinkedCount?: number | null;
      readonly textileUnlinkedCount?: number | null;
    };
  };
};

export type ProductComplianceLinksResponseData = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly links?: ReadonlyArray<PickedProductLink> | null;
      readonly linkCount?: number | null;
      readonly unlinkedCount?: number | null;
    };
  };
};

export type ProductComplianceLinksRequestData =
  ProductComplianceSchemaLinksArgs &
    ProductComplianceSchemaFranceProductUniqueIdentificationNumbersArgs;

export const PRODUCT_COMPLIANCE_LINKS_QUERY = gql`
  query ProductComplianceLinks_ProductEprTable(
    $offset: Int!
    $limit: Int!
    $franceUinCategories: [FranceProductUniqueIdentificationNumberCategory!]
    $query: String
    $searchType: ProductComplianceSearchType
  ) {
    policy {
      productCompliance {
        linkCount(
          franceUinCategories: $franceUinCategories
          complianceTypes: [FR_COMPLIANCE]
          query: $query
          searchType: $searchType
        )
        unlinkedCount: linkCount(
          franceUinCategories: $franceUinCategories
          complianceTypes: [FR_COMPLIANCE]
          isLinkedWithFranceUin: false
        )
        links(
          limit: $limit
          offset: $offset
          franceUinCategories: $franceUinCategories
          complianceTypes: [FR_COMPLIANCE]
          query: $query
          searchType: $searchType
        ) {
          id
          reviewState
          isLinkedWithFranceUin
          product {
            name
            id
          }
        }
      }
    }
  }
`;

export type LinkCountRequestData = ProductComplianceSchemaLinkCountArgs;

export type LinkCountResponseData = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly linkCount?: number | null;
    };
  };
};

export const LINK_COUNT_QUERY = gql`
  query LinkCount_UinModal(
    $franceUinCategories: [FranceProductUniqueIdentificationNumberCategory!]
  ) {
    policy {
      productCompliance {
        linkCount(
          complianceTypes: [FR_COMPLIANCE]
          franceUinCategories: $franceUinCategories
          isLinkedWithFranceUin: true
        )
      }
    }
  }
`;

type GetUinDataByCategoryDataType = {
  [key in FranceProductUniqueIdentificationNumberCategory]: PickedFranceUinSchema | null;
};

export const useUinDataByCategory = (
  uinData: ReadonlyArray<PickedFranceUinSchema>
): GetUinDataByCategoryDataType =>
  useMemo(() => {
    const dataByCategory: GetUinDataByCategoryDataType = {
      SECONDARY_PACKAGING: null,
      ELECTRIC_AND_ELECTRONIC_EQUIPMENTS: null,
      PRIMARY_PACKAGING: null,
      TEXTILE: null,
      BATTERIES: null,
      PAPER: null,
      TIRES: null,
      FURNITURE: null,
    };

    uinData.forEach((data) => {
      if (data.category != null) {
        dataByCategory[data.category] = data;
      }
    });

    return dataByCategory;
  }, [uinData]);

export const ProductCategoryLabel: {
  [type in FranceProductUniqueIdentificationNumberCategory]: string;
} = {
  SECONDARY_PACKAGING: i`Secondary Packaging`,
  ELECTRIC_AND_ELECTRONIC_EQUIPMENTS: i`Electric and Electronic Equipment (EEE)`,
  PRIMARY_PACKAGING: i`Primary Packaging`,
  TEXTILE: i`Textile`,
  BATTERIES: i`Batteries`,
  PAPER: i`Paper`,
  TIRES: i`Tires`,
  FURNITURE: i`Furniture`,
};

export const ProductCategoryLabelShortName: {
  [type in FranceProductUniqueIdentificationNumberCategory]: string;
} = {
  ...ProductCategoryLabel,
  ELECTRIC_AND_ELECTRONIC_EQUIPMENTS: i`Electric (EEE)`,
};

export const CategoryStatusLabel: {
  [type in FranceProductUniqueIdentificationNumberStatus]: string;
} = {
  ADMIN_APPROVED: i`Approved`,
  COMPLETE: i`Approved`,
  REJECTED: i`Rejected`,
  INREVIEW: i`In Review`,
  DELETED: i`Deleted`,
};

export const CategoryStatusThemeColor: {
  [type in FranceProductUniqueIdentificationNumberStatus]: Theme;
} = {
  ADMIN_APPROVED: `LighterCyan`,
  COMPLETE: `LighterCyan`,
  REJECTED: `Red`,
  INREVIEW: `Grey`,
  DELETED: `Red`,
};

export const APPROVED_STATUSES: ReadonlyArray<FranceProductUniqueIdentificationNumberStatus> =
  ["ADMIN_APPROVED", "COMPLETE"];
