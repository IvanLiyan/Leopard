import { CsvProductImportJobSchema } from "@schema/types";

export type CsvProductJobType = Pick<
  CsvProductImportJobSchema,
  | "id"
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
