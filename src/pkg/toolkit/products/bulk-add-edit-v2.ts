import { gql } from "@apollo/client/core";
import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";
import {
  DownloadAllProductsCsv,
  MerchantSchema,
  ProductCatalogMutationsDownloadAllProductsCsvArgs,
  ProductCatalogMutationsUpsertProductCsvFileArgs,
  ProductCsvImportColumnSchema,
  ProductCsvJobType,
  UpsertProductsFromCsvFile,
  IsRequiredEnum,
  ColumnCategorySchema,
  ProductSchema,
} from "@schema/types";
import ExampleAddProduct from "@toolkit/products/bulk-csv-examples-templates/example-add-product.csv";
import ExampleAddVariationsExistingProducts from "@toolkit/products/bulk-csv-examples-templates/example-add-variations-existing-products.csv";
import ExampleEditProduct from "@toolkit/products/bulk-csv-examples-templates/example-edit-product.csv";
import ExampleEditShipping from "@toolkit/products/bulk-csv-examples-templates/example-edit-shipping.csv";
import ExampleShopifyProduct from "@toolkit/products/bulk-csv-examples-templates/example-add-shopify-product.csv";
import ExampleMplusAddEditProductNoShip from "@toolkit/products/bulk-csv-examples-templates/example-mplus-add-edit-product-no-ship.csv";
import ExampleMplusAddEditProduct from "@toolkit/products/bulk-csv-examples-templates/example-mplus-add-edit-product.csv";
import TemplateAddProduct from "@toolkit/products/bulk-csv-examples-templates/template-add-product.csv";
import TemplateAddVariationsExistingProducts from "@toolkit/products/bulk-csv-examples-templates/template-add-variations-existing-products.csv";
import TemplateEditProduct from "@toolkit/products/bulk-csv-examples-templates/template-edit-product.csv";
import TemplateEditShipping from "@toolkit/products/bulk-csv-examples-templates/template-edit-shipping.csv";
import TemplateShopifyProduct from "@toolkit/products/bulk-csv-examples-templates/template-add-shopify-product.csv";
import TemplateMplusAddEditProduct from "@toolkit/products/bulk-csv-examples-templates/template-mplus-add-edit-product.csv";
import ExampleCostBasedAddProduct from "@toolkit/products/bulk-csv-examples-templates/example-cost-based-add-product.csv";
import ExampleCostBasedEditProduct from "@toolkit/products/bulk-csv-examples-templates/example-cost-based-edit-product.csv";
import ExampleCostBasedAddVariationsExistingProducts from "@toolkit/products/bulk-csv-examples-templates/example-cost-based-add-variations-existing-products.csv";
import ExampleCostBasedShopifyProduct from "@toolkit/products/bulk-csv-examples-templates/example-cost-based-add-shopify-product.csv";
import TemplateCostBasedAddProduct from "@toolkit/products/bulk-csv-examples-templates/template-cost-based-add-product.csv";
import TemplateCostBasedEditProduct from "@toolkit/products/bulk-csv-examples-templates/template-cost-based-edit-product.csv";
import TemplateCostBasedAddVariationsExistingProducts from "@toolkit/products/bulk-csv-examples-templates/template-cost-based-add-variations-existing-products.csv";
import TemplateCostBasedShopifyProduct from "@toolkit/products/bulk-csv-examples-templates/template-cost-based-add-shopify-product.csv";
import { IllustrationName } from "@merchant/component/core";

export type BulkAddEditHideableCard = "UPLOAD_CSV" | "COLUMN_MAPPING";

export type PickedProductCsvImportColumnSchema = Pick<
  ProductCsvImportColumnSchema,
  "columnId" | "name" | "description"
> & {
  readonly upsertProductsRequired: IsRequiredEnum;
  readonly addProductRequired: IsRequiredEnum;
  readonly editShippingRequired: IsRequiredEnum;
  readonly updateProductsRequired: IsRequiredEnum;
  readonly addSizeColorRequired: IsRequiredEnum;
  readonly shopifyCreateProductsRequired: IsRequiredEnum;
  readonly category?: Pick<ColumnCategorySchema, "id" | "name">;
};

export type BulkAddEditInitialData = {
  readonly platformConstants: {
    readonly productCsvImportColumns: {
      readonly columns: ReadonlyArray<PickedProductCsvImportColumnSchema>;
    };
  };
  readonly currentMerchant: Pick<
    MerchantSchema,
    "canManageShipping" | "isStoreMerchant" | "isMerchantPlus"
  >;
  readonly currentUser: {
    readonly gating: {
      readonly showShopifyProductCsvUpload: boolean;
    };
  };
  readonly productCatalog?: {
    readonly products: ReadonlyArray<Pick<ProductSchema, "id">>;
  };
};

export const AttributeIconMap: {
  readonly [isRequired in IsRequiredEnum]: IllustrationName;
} = {
  REQUIRED: "darkGreenCheckmark",
  OPTIONAL: "grayDash",
  NOT_INCLUDED: "disable",
};

export const AttributeDisplayNameMap: {
  readonly [isRequired in IsRequiredEnum]: string;
} = {
  REQUIRED: i`Required`,
  OPTIONAL: i`Optional`,
  NOT_INCLUDED: i`Not applicable`,
};

const shopifyDisplayName = i`Import Shopify Products`;
const shopifyDescription =
  i`Add new products by uploading the product export from your ` +
  i`Shopify store.`;

// Merchant dashboard actions
export type ActionType = ExtractStrict<
  ProductCsvJobType,
  | "ADD_PRODUCTS"
  | "ADD_SIZE_COLOR"
  | "EDIT_SHIPPING"
  | "UPDATE_PRODUCTS"
  | "SHOPIFY_CREATE_PRODUCTS"
>;

export const ActionTypeDisplayNames: { [action in ActionType]: string } = {
  ADD_PRODUCTS: i`Add products`,
  ADD_SIZE_COLOR: i`Add variations to existing products`,
  EDIT_SHIPPING: i`Edit shipping`,
  UPDATE_PRODUCTS: i`Edit products`,
  SHOPIFY_CREATE_PRODUCTS: shopifyDisplayName,
};

export const ActionTypeDescriptions: { [action in ActionType]: string } = {
  ADD_PRODUCTS: i`Add new products to your store.`,
  ADD_SIZE_COLOR: i`Add new variations to your existing products.`,
  EDIT_SHIPPING:
    i`Edit Default Shipping Price, Country Shipping Price, and TTD for your ` +
    i`exisiting products.`,
  UPDATE_PRODUCTS: i`Edit attributes for your existing products.`,
  SHOPIFY_CREATE_PRODUCTS: shopifyDescription,
};

export const ActionTypeOrder: ReadonlyArray<ActionType> = [
  "ADD_PRODUCTS",
  "UPDATE_PRODUCTS",
  "EDIT_SHIPPING",
  "ADD_SIZE_COLOR",
  "SHOPIFY_CREATE_PRODUCTS",
];

export const ActionOptions: ReadonlyArray<Option<
  ActionType
>> = ActionTypeOrder.map((value: ActionType) => ({
  value,
  text: ActionTypeDisplayNames[value],
}));

// Merchant plus actions
export type PlusActionType = ExtractStrict<
  ProductCsvJobType,
  "UPSERT_PRODUCTS" | "SHOPIFY_CREATE_PRODUCTS"
>;
export const PlusActionTypeDisplayNames: {
  readonly [action in PlusActionType]: string;
} = {
  UPSERT_PRODUCTS: i`Add/edit products`,
  SHOPIFY_CREATE_PRODUCTS: shopifyDisplayName,
};

export const PlusActionTypeDescriptions: {
  readonly [action in PlusActionType]: string;
} = {
  UPSERT_PRODUCTS:
    i`Add new products to your store or edit attributes for your existing ` +
    i`products.`,
  SHOPIFY_CREATE_PRODUCTS: shopifyDescription,
};

export const PlusActionTypeOrder: ReadonlyArray<PlusActionType> = [
  "UPSERT_PRODUCTS",
  "SHOPIFY_CREATE_PRODUCTS",
];

export const PlusActionOptions: ReadonlyArray<Option<
  PlusActionType
>> = PlusActionTypeOrder.map((value: PlusActionType) => ({
  value,
  text: PlusActionTypeDisplayNames[value],
}));

export const CsvExampleMap: {
  readonly [type in
    | ActionType
    | PlusActionType
    | "UPSERT_PRODUCTS_NO_SHIP"]: string;
} = {
  ADD_PRODUCTS: ExampleAddProduct,
  ADD_SIZE_COLOR: ExampleAddVariationsExistingProducts,
  UPDATE_PRODUCTS: ExampleEditProduct,
  EDIT_SHIPPING: ExampleEditShipping,
  UPSERT_PRODUCTS: ExampleMplusAddEditProductNoShip,
  UPSERT_PRODUCTS_NO_SHIP: ExampleMplusAddEditProduct,
  SHOPIFY_CREATE_PRODUCTS: ExampleShopifyProduct,
};

export const CsvTemplateMap: {
  readonly [type in ActionType | PlusActionType]: string;
} = {
  ADD_PRODUCTS: TemplateAddProduct,
  ADD_SIZE_COLOR: TemplateAddVariationsExistingProducts,
  UPDATE_PRODUCTS: TemplateEditProduct,
  EDIT_SHIPPING: TemplateEditShipping,
  UPSERT_PRODUCTS: TemplateMplusAddEditProduct,
  SHOPIFY_CREATE_PRODUCTS: TemplateShopifyProduct,
};

export const CsvExampleMapCostBased: {
  [type in ActionType | PlusActionType]: string;
} = {
  ADD_PRODUCTS: ExampleCostBasedAddProduct,
  ADD_SIZE_COLOR: ExampleCostBasedAddVariationsExistingProducts,
  UPDATE_PRODUCTS: ExampleCostBasedEditProduct,
  EDIT_SHIPPING: ExampleCostBasedEditProduct,
  UPSERT_PRODUCTS: ExampleCostBasedEditProduct,
  SHOPIFY_CREATE_PRODUCTS: ExampleCostBasedShopifyProduct,
};

export const CsvTemplateMapCostBased: {
  [type in ActionType | PlusActionType]: string;
} = {
  ADD_PRODUCTS: TemplateCostBasedAddProduct,
  ADD_SIZE_COLOR: TemplateCostBasedAddVariationsExistingProducts,
  UPDATE_PRODUCTS: TemplateCostBasedEditProduct,
  EDIT_SHIPPING: TemplateCostBasedEditProduct,
  UPSERT_PRODUCTS: TemplateCostBasedEditProduct,
  SHOPIFY_CREATE_PRODUCTS: TemplateCostBasedShopifyProduct,
};

// Mutation - upsert product csv
export const UPSERT_PRODUCT_CSV = gql`
  mutation BulkAddEdit_UpsertProductCsv(
    $input: UpsertProductsFromCSVFileInput!
  ) {
    productCatalog {
      upsertProductCsvFile(input: $input) {
        ok
        jobId
        message
      }
    }
  }
`;

export type UpsertProductCsvInputType = ProductCatalogMutationsUpsertProductCsvFileArgs;
export type UpsertProductCsvResponseType = {
  readonly productCatalog: {
    readonly upsertProductCsvFile: Pick<
      UpsertProductsFromCsvFile,
      "ok" | "message" | "jobId"
    >;
  };
};

// Mutation - download all CSV
export const DOWNLOAD_ALL_PRODUCTS_CSV = gql`
  mutation BulkAddEdit_DownloadAllProductsCsv(
    $input: DownloadAllProductsCSVInput!
  ) {
    productCatalog {
      downloadAllProductsCsv(input: $input) {
        ok
        errorMessage
      }
    }
  }
`;

export type DownloadAllProductsCsvInputType = ProductCatalogMutationsDownloadAllProductsCsvArgs;
export type DownloadAllProductsCsvResponseType = {
  readonly productCatalog: {
    readonly downloadAllProductsCsv: Pick<
      DownloadAllProductsCsv,
      "ok" | "errorMessage"
    >;
  };
};

export type GetColumnNamesType = ProductCsvImportColumnSchema;
