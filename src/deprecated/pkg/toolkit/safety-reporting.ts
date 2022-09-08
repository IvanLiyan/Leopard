/*
 * safety-reporting.ts
 *
 * Created by Don Sirivat on Fri Mar 11 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import gql from "graphql-tag";
import {
  OrderReportReasonSchema,
  ReportOrderInput,
  ReportOrderMutation,
  ReportOrderReasons,
} from "@schema/types";

// Query that fetches order report reasons to display on select component
export const GET_ORDER_REPORT_REASONS_QUERY = gql`
  query MerchantSafety_GetOrderReportReasonsQuery {
    merchantSafetyInfo {
      reportOrderReasons {
        reportOrderReason
        reportOrderReasonText
      }
    }
  }
`;

export type PickedReportReason = Pick<
  OrderReportReasonSchema,
  "reportOrderReason" | "reportOrderReasonText"
>;

export type GetOrderReportReasonsResponseType = {
  readonly merchantSafetyInfo: {
    readonly reportOrderReasons: ReadonlyArray<PickedReportReason>;
  };
};

// Mutation that submits a suspicious order report
export const SUBMIT_SUSPICIOUS_ORDER_REPORT = gql`
  mutation OrdersTable_SubmitSuspiciousOrderReport($input: ReportOrderInput!) {
    merchantSafety {
      reportOrder(input: $input) {
        ok
        errMessage
      }
    }
  }
`;

export type SubmitSuspiciousOrderReportResponseType = {
  readonly merchantSafety: {
    readonly reportOrder?: Pick<
      ReportOrderMutation,
      "ok" | "errMessage"
    > | null;
  };
};

export type SubmitSuspiciousOrderReportInputType = {
  readonly input: Pick<
    ReportOrderInput,
    "mTransactionId" | "reportExplanation"
  > & {
    readonly reportReasons: ReadonlyArray<ReportOrderReasons>;
  };
};
