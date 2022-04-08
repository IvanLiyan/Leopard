import { gql } from "@apollo/client/core";
import { CreateBulkOneoffAdminToolPayments } from "@schema/types";

export type CreateBulkOneoffAdminToolPaymentsResponseType = {
  readonly oneoffPayments: {
    readonly createBulkOneoffAdminToolPayments: Pick<
      CreateBulkOneoffAdminToolPayments,
      "ok" | "message"
    >;
  };
};

// Mutation - CreateBulkOneoffAdminToolPayments
export const CREATE_BULK_ONEOFF_ADMIN_TOOL_PAYMENT = gql`
  mutation BulkCreate_OneoffAdminToolPayment(
    $input: CreateBulkOneoffAdminToolPaymentsInput!
  ) {
    oneoffPayments {
      createBulkOneoffAdminToolPayments(input: $input) {
        ok
        message
      }
    }
  }
`;

// Not ideal to hardcode, but BE already assumes these column names, if updating then please
// also update HEADERS_TO_FIELDS in MerchantOneoffPaymentProcessor.import_csv_queue_batch_mop_jobs
/* eslint-disable local-rules/unwrapped-i18n */
export const VALID_HEADER_COLUMNS = [
  "Merchant ID",
  "Amount",
  "Currency",
  "Note to merchant",
  "Reference ID",
];
