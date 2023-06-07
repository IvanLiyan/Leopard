import {
  ProductCatalogMutationsUpsertProductCsvFileArgs,
  TaxonomySchema,
  UpsertProductsFromCsvFile,
} from "@schema";
import { gql } from "@apollo/client";

export const GET_TAXONOMY_TREE_CSV_ROWS_QUERY = gql`
  query CSV_GetTaxonomyTreeCsvRows {
    taxonomy {
      taxonomyTreeCsv
    }
  }
`;

export type GetTaxonomyTreeCsvRowsResponseType = {
  readonly taxonomy?: Pick<TaxonomySchema, "taxonomyTreeCsv"> | null;
};

export const UPSERT_PRODUCT_CSV_MUTATION = gql`
  mutation CSV_UpsertProductCsvMutation(
    $input: UpsertProductsFromCSVFileInput!
  ) {
    productCatalog {
      upsertProductCsvFile(input: $input) {
        ok
        message
        jobId
      }
    }
  }
`;

export type UpsertProductCsvResponseType = {
  readonly productCatalog: {
    readonly upsertProductCsvFile?: Pick<
      UpsertProductsFromCsvFile,
      "ok" | "message" | "jobId"
    > | null;
  };
};

export type UpsertProductCsvRequestType =
  ProductCatalogMutationsUpsertProductCsvFileArgs;
