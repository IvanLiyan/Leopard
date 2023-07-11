import { gql } from "@gql";
import {
  MerchantLeadSubmissionMutation,
  MerchantLeadSubmissionInput,
} from "@schema";

export const MERCHANT_LEAD_SUBMIT = gql(`
  mutation Questionnaire_MerchantLeadSubmit(
    $input: MerchantLeadSubmissionInput!
  ) {
    authentication {
      merchantLeadSubmission(input: $input) {
        ok
        message
      }
    }
  }
`);

export type MerchantLeadSubmissionResponseType = {
  readonly authentication: {
    readonly merchantLeadSubmission?: Pick<
      MerchantLeadSubmissionMutation,
      "ok" | "message"
    >;
  };
};

export type MerchantLeadSubmissionInputType = {
  readonly input: MerchantLeadSubmissionInput;
};
