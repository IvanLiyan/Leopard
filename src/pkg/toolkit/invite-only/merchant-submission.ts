/*
 * merchant-submission.ts
 *
 * Created by Don Sirivat on Jan 21 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import gql from "graphql-tag";
import {
  MerchantLeadSubmissionMutation,
  MerchantLeadSubmissionInput,
} from "@schema/types";

export const MERCHANT_LEAD_SUBMIT = gql`
  mutation Authentication_MerchantLeadSubmit(
    $input: MerchantLeadSubmissionInput!
  ) {
    authentication {
      merchantLeadSubmission(input: $input) {
        ok
        message
      }
    }
  }
`;

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
