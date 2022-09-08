/* Lego Components */
import { OptionType } from "@ContextLogic/lego";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

// Values are code enums, shoudln't be translated.
/* eslint-disable local-rules/unwrapped-i18n */
export type EarlyPaymentState =
  | "Open"
  | "Closed"
  | "Cancelled"
  | "To Be Processed"
  | "In Process";

export type GetEarlyPaymentDetailParams = {
  readonly early_payment_id: string;
};

// fields from MerchantOneoffPayment and MerchantFine needed for early payment detail page
export type OneoffFine = {
  readonly id: string | null | undefined;
  readonly paid: boolean;
  readonly pay_date: string;
  readonly status: string;
  readonly amount: number;
  readonly mpid: string | null | undefined;
};

export type GetEarlyPaymentDetailResponse = {
  readonly oneoff_payment: OneoffFine;
  readonly fines: ReadonlyArray<OneoffFine>;
  readonly early_payment: EarlyPayment;
  readonly reimbursement_fee_oneoff_payment: OneoffFine;
};

export const getEarlyPaymentDetail = (
  args: GetEarlyPaymentDetailParams
): MerchantAPIRequest<
  GetEarlyPaymentDetailParams,
  GetEarlyPaymentDetailResponse
> =>
  new MerchantAPIRequest("early-payment-detail/get-early-payment-detail", args);

export type EarlyPayment = {
  readonly id: string;
  readonly status: EarlyPaymentState;
  readonly creation_time: number;
  readonly currency: string;
  readonly num_repayments: number;
  readonly deduction_amount: number;
  readonly payment_amount: number;
  readonly monthly_interest_rate: number;
  readonly term_name: string;
  readonly num_deducted: number;
  readonly is_processed: boolean;
  readonly cancel_reason_to_merchant?: string | null | undefined;
  readonly note_to_merchant?: string | null | undefined;
};

export type GetEarlyPaymentParams = {
  readonly start: number;
  readonly count: number;
  readonly filter_statuses: ReadonlyArray<number>;
  readonly early_payment_id: string;
};

export type GetEarlyPaymentEligibilityResponse = {
  readonly is_merchant_on_vacation: boolean;
  readonly not_suspended_and_no_holds: boolean;
  readonly source_currency: string;
  readonly available_ep_amount: number;
  readonly is_disbursement_day: boolean;
  readonly close_to_disb_day: boolean;
  readonly can_see_page: boolean;
  readonly confirmed_balance: number;
  readonly lowest_fee_rate: number;
  readonly largest_fee_rate: number;
};

export type GetEarlyPaymentResponse = {
  readonly early_payments: ReadonlyArray<EarlyPayment>;
  readonly total_count: number;
  readonly has_more: boolean;
};

export type GetEarlyPaymentFilterOptionsResponse = {
  readonly status_options: ReadonlyArray<OptionType>;
};

export const getEarlyPayments = (
  args: GetEarlyPaymentParams
): MerchantAPIRequest<GetEarlyPaymentParams, GetEarlyPaymentResponse> =>
  new MerchantAPIRequest("early-payment-history/get-early-payments", args);

export const getEarlyPaymentFilterOptions = (): MerchantAPIRequest<
  {},
  GetEarlyPaymentFilterOptionsResponse
> =>
  new MerchantAPIRequest(
    "early-payment-history/get-early-payment-filter-options"
  );

export const getEligibilityForEarlyPayments = (): MerchantAPIRequest<
  {},
  GetEarlyPaymentEligibilityResponse
> =>
  new MerchantAPIRequest("early-payment-history/get-early-payment-eligibility");

export type EarlyPaymentTermInfo = {
  readonly name: string;
  readonly monthly_interest_rate: number;
  readonly dates: ReadonlyArray<string>;
};

export type EarlyPaymentPolicy = {
  readonly pending_balance_percentage: number;
  readonly currency: string;
  readonly maximum_amount: number;
  readonly next_payment_date: string;
  readonly is_v3: boolean;
  readonly term_info_dict: {
    readonly [key: number]: EarlyPaymentTermInfo;
  };
  readonly default_term: number;
};

export const getEarlyPaymentPolicy = (): MerchantAPIRequest<
  null,
  EarlyPaymentPolicy
> => new MerchantAPIRequest("get-merchant-early-payment-policy");

export type RequestEarlyPaymentParam = {
  readonly request_amount: number;
  readonly early_payment_term_type: number;
};

export type RequestEarlyPaymentResp = {
  readonly succeeded: boolean;
  readonly reason: string;
};

export const requestEarlyPayment = (
  args: RequestEarlyPaymentParam
): MerchantAPIRequest<RequestEarlyPaymentParam, RequestEarlyPaymentResp> =>
  new MerchantAPIRequest("request-merchant-early-payment", args);

export type EarlyPaymentAvailbleAmountResp = {
  readonly available_amount: number;
  readonly currency: string;
};

export const getEarlyPaymentAvailableAmount = (): MerchantAPIRequest<
  null,
  EarlyPaymentAvailbleAmountResp
> => new MerchantAPIRequest("get-merchant-early-payment-available-amount");
