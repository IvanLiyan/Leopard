import {
  CsvProductImportJobSchema,
  CsvProductImportJobSchemaV2,
  Datetime,
  ProductCsvJobType,
  ProductCatalogSchema,
  CsvProductImportJobDetailSchema,
} from "@schema";
import {
  ActionTypeDisplayNames,
  PlusActionTypeDisplayNames,
} from "./BulkAddEdit";

export type CsvProductJobType = Pick<
  CsvProductImportJobSchema,
  | "id"
  | "feedType"
  | "status"
  | "csvUrl"
  | "totalRows"
  | "errorCount"
  | "addedCount"
  | "updatedCount"
  | "processedCount"
  | "fileName"
  | "fpApprovedCount"
  | "fpBlockedCount"
> & {
  readonly startTime: Pick<Datetime, "unix">;
};

export type newBulkCsvJobs = Pick<
  CsvProductImportJobSchemaV2,
  | "completedTime"
  | "feedType"
  | "fileName"
  | "id"
  | "startTime"
  | "status"
  | "version"
>;

export type newBulkCsvJobsCount = Pick<
  ProductCatalogSchema,
  "newBulkCsvJobsCount"
>;

export type newBulkCsvJobDetail = Pick<
  CsvProductImportJobDetailSchema,
  | "id"
  | "fileName"
  | "fileLink"
  | "startTime"
  | "completedTime"
  | "feedType"
  | "status"
  | "totalCount"
  | "aliveCount"
  | "errorsCount"
  | "processingCount"
  | "underReviewCount"
  | "noChangesCount"
>;

export const ProductCsvJobTypeOrder: ReadonlyArray<ProductCsvJobType> = [
  "NEW_ADD_PRODUCTS",
  "NEW_UPDATE_PRODUCTS",
  "NEW_ADD_VARIATION",
];

export const ProductCsvJobTypeDisplayNames: {
  readonly [T in ProductCsvJobType]: string;
} = {
  ...ActionTypeDisplayNames,
  ...PlusActionTypeDisplayNames,
  CREATE_PRESALE_PRODUCT: i`Create Presale Products`,
  EDIT_WISH_EXPRESS_COUNTRIES: i`Edit Wish Express Countries`,
  EDIT_FBW_SHIPPING: i`Edit FBW Shipping`,
  NEW_ADD_PRODUCTS: i`Add a new product`,
  NEW_UPDATE_PRODUCTS: i`Edit a existing product`,
  NEW_ADD_VARIATION: i`Add variation to the existing product`,
};
