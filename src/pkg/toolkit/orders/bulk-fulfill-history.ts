import { CsvFulfillmentJobSchema } from "@schema/types";

export type CsvFulfillmentJobType = Pick<
  CsvFulfillmentJobSchema,
  | "id"
  | "csvUrl"
  | "fulfilledCount"
  | "errorCount"
  | "totalRows"
  | "status"
  | "processedCount"
  | "startTime"
  | "fileName"
>;
