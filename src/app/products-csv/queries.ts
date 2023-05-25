import { TaxonomySchema } from "@schema";
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
