import { CsvProductImportJobSchema, ProductCsvJobType } from "@schema/types";
import {
  ActionTypeDisplayNames,
  PlusActionTypeDisplayNames,
} from "@toolkit/products/bulk-add-edit";

export type CsvProductJobType = Pick<
  CsvProductImportJobSchema,
  | "id"
  | "feedType"
  | "startTime"
  | "status"
  | "csvUrl"
  | "totalRows"
  | "errorCount"
  | "addedCount"
  | "updatedCount"
  | "processedCount"
  | "fileName"
>;

export const ProductCsvJobTypeOrder: ReadonlyArray<ProductCsvJobType> = [
  "ADD_PRODUCTS",
  "CREATE_PRESALE_PRODUCT",
  "EDIT_WISH_EXPRESS_COUNTRIES",
  "SHOPIFY_CREATE_PRODUCTS",
  "UPSERT_PRODUCTS",
  "EDIT_FBW_SHIPPING",
  "EDIT_SHIPPING",
  "ADD_SIZE_COLOR",
  "UPDATE_PRODUCTS",
];

export const ProductCsvJobTypeDisplayNames: {
  readonly [T in ProductCsvJobType]: string;
} = {
  ...ActionTypeDisplayNames,
  ...PlusActionTypeDisplayNames,
  CREATE_PRESALE_PRODUCT: i`Create Presale Products`,
  EDIT_WISH_EXPRESS_COUNTRIES: i`Edit Wish Express Countries`,
  EDIT_FBW_SHIPPING: i`Edit FBW Shipping`,
};
