import {
  DownloadAllProducts,
  ProductCatalogMutationsDownloadAllProductsArgs,
  ProductCatalogMutationsUpsertProductCsvFileArgs,
  ProductCatalogSchema,
  TaxonomySchema,
  MerchantSchema,
  UpsertProductsFromCsvFile,
  ProductCatalogSchemaCsvAllHeaderNamesArgs,
  ProductCatalogSchemaCsvEditVariationsHeaderNamesArgs,
} from "@schema";
import { gql } from "@gql";

export const GET_TAXONOMY_TREE_CSV_ROWS_QUERY = gql(`
  query CSV_GetTaxonomyTreeCsvRows {
    taxonomy {
      taxonomyTreeCsv
    }
  }
`);

export type GetTaxonomyTreeCsvRowsResponseType = {
  readonly taxonomy?: Pick<TaxonomySchema, "taxonomyTreeCsv"> | null;
};

export const UPSERT_PRODUCT_CSV_MUTATION = gql(`
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
`);

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

export const DOWNLOAD_PRODUCT_CATALOG_MUTATION = gql(`
  mutation downloadProductCatalog($input: DownloadAllProductsInput!) {
    productCatalog {
      downloadAllProducts(input: $input) {
        errorMessage
        ok
      }
    }
  }
`);

export type DownloadProductCatalogResponseType = {
  readonly productCatalog: {
    readonly downloadAllProducts?: Pick<
      DownloadAllProducts,
      "ok" | "errorMessage"
    > | null;
  };
};

export type DownloadProductCatalogRequestType =
  ProductCatalogMutationsDownloadAllProductsArgs;

export const DOWNLOAD_ALL_HEADERS_QUERY = gql(`
  query DownloadAllHeaders($subcategoryIds: [Int!]) {
    productCatalog {
      csvAllHeaderNames(subcategoryIds: $subcategoryIds)
    }
  }
`);

export type DownloadAllHeadersResponseType = {
  readonly productCatalog?: Pick<
    ProductCatalogSchema,
    "csvAllHeaderNames"
  > | null;
};

export type DownloadAllHeadersRequestType =
  ProductCatalogSchemaCsvAllHeaderNamesArgs;

export const DOWNLOAD_EDIT_VARIATION_HEADERS_QUERY = gql(`
  query DownloadEditVariationHeaders($subcategoryIds: [Int!]) {
    productCatalog {
      csvEditVariationsHeaderNames(subcategoryIds: $subcategoryIds)
    }
  }
`);

export type DownloadEditVariationHeadersResponseType = {
  readonly productCatalog?: Pick<
    ProductCatalogSchema,
    "csvEditVariationsHeaderNames"
  > | null;
};

export type DownloadEditVariationHeadersRequestType =
  ProductCatalogSchemaCsvEditVariationsHeaderNamesArgs;

export const DOWNLOAD_SHIPPING_HEADERS_QUERY = gql(`
  query DownloadShippingHeaders {
    productCatalog {
      csvShippingHeaderNames
    }
  }
`);

export type DownloadShippingHeadersResponseType = {
  readonly productCatalog?: Pick<
    ProductCatalogSchema,
    "csvShippingHeaderNames"
  > | null;
};

export const DOWNLOAD_PRICE_INVENTORY_HEADERS_QUERY = gql(`
  query DownloadPriceInventoryHeaders {
    productCatalog {
      csvPriceInventoryHeaderNames
    }
  }
`);

export type DownloadPriceInventoryHeadersResponseType = {
  readonly productCatalog?: Pick<
    ProductCatalogSchema,
    "csvPriceInventoryHeaderNames"
  > | null;
};

export const DOWNLOAD_TITLE_IMAGE_DESC_HEADERS_QUERY = gql(`
  query DownloadTitleImageDescHeaders {
    productCatalog {
      csvTitleImagesDescriptionHeaderNames
    }
  }
`);

export type DownloadTitleImageDescHeadersResponseType = {
  readonly productCatalog?: Pick<
    ProductCatalogSchema,
    "csvTitleImagesDescriptionHeaderNames"
  > | null;
};

export const DOWNLOAD_ENABLE_DISABLE_HEADERS_QUERY = gql(`
  query DownloadEnableDisableHeaders {
    productCatalog {
      csvEnableDisableHeaderNames
    }
  }
`);

export type DownloadEnableDisableHeadersResponseType = {
  readonly productCatalog?: Pick<
    ProductCatalogSchema,
    "csvEnableDisableHeaderNames"
  > | null;
};

export const DOWNLOAD_CSV_CONSIGNMENT_HEADERS_QUERY = gql(`
  query DownloadCsvConsignmentHeaders {
    productCatalog {
      csvConsignmentHeaderNames
    }
  }
`);

export type DownloadCsvConsignmentHeadersResponseType = {
  readonly productCatalog?: Pick<
    ProductCatalogSchema,
    "csvConsignmentHeaderNames"
  > | null;
};

export const MERCHANT_CONSIGNMENT_MODE_QUERY = gql(`
  query merchantConsignmentModeQuery {
    currentMerchant {
      isConsignmentMode
    }
  }
`);
export type GetConsignmentModeResponseType = {
  readonly currentMerchant: Pick<MerchantSchema, "isConsignmentMode">;
};
